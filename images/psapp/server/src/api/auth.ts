import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { UserRelationship } from '../entity/UserRelationship';
import { env } from '../env';
import { UserType } from '../../../common/types';
import { typedPost } from '../typedRoutes';
import { isValidEmail } from '../utils';
import { JWTUser } from '../types';

export const setLoginCookie = (req: express.Request, resp: express.Response, userId?: number) => {
  const jwtUser: JWTUser = {
    email: req.body.email,
    selectedUserId: userId
  };
  const token = jwt.sign(jwtUser, env['JWT_SIGNING_KEY']!);

  const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
  resp.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: ONE_YEAR,
  });
};

export const clearLoginCookie = (resp: express.Response) => {
  resp.clearCookie('authToken');
};

export const setupAuthRoutes = (router: express.Router) => {
  typedPost(router, '/api/auth/register', async (req, resp, next) => {
    if (!isValidEmail(req.body.email)) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.invalid',
        email: req.body.email,
        message: 'Email is invalid',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: req.body.email });
    if (user) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.alreadyRegistered',
        email: req.body.email,
        message: 'Email already registered',
      });
    }

    const isAdult = (req.body.type === UserType.PARENT || req.body.type === UserType.TEACHER);
    const defaultPin = "4000";

    await userRepo.insert({
      name: req.body.name,
      email: req.body.email,
      hashed: await bcrypt.hash(req.body.password, 12),
      type: req.body.type,
      pin: isAdult ? defaultPin : undefined,
      pinRequired: isAdult
    });

    setLoginCookie(req, resp);
    resp.json({success: true});
  });

  typedPost(router, '/api/auth/login', async (req, resp, next) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: req.body.email });
    if (!user) {
      return resp.status(422).json({
        errorCode: 'auth.login.email.nonexistent',
        email: req.body.email,
        message: 'Email does not exist',
      });
    }

    if (!user.hashed) {
      return resp.status(401).json({
        errorCode: 'auth.login.password.notset',
        message: 'User has no password set',
      });
    }

    if (!await bcrypt.compare(req.body.password, user.hashed)) {
      return resp.status(401).json({
        errorCode: 'auth.login.password.invalid',
        message: 'Password is not valid',
      });
    }

    setLoginCookie(req, resp);
    resp.json({success: true});
  });

  typedPost(router, '/api/auth/logout', async (req, resp, next) => {
    clearLoginCookie(resp);
    resp.json({success: true});
  });

  typedPost(router, '/api/auth/switch', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'auth.switch.notLoggedIn',
        message: 'You need to be logged in to switch accounts',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const adultUser = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!adultUser) {
      return resp.status(401).json({
        errorCode: 'auth.switch.notLoggedIn',
        message: 'Could not find the logged-in user',
      });
    }

    if (adultUser.type !== UserType.PARENT && adultUser.type !== UserType.TEACHER) {
      return resp.status(403).json({
        errorCode: 'auth.switch.notParentOrTeacher',
        message: 'Only parent or teacher accounts can switch to child accounts',
      });
    }

    const targetUserId = parseInt(req.body.targetId);
    if (isNaN(targetUserId)) {
      return resp.status(400).json({
        errorCode: 'auth.switch.invalidUser',
        message: 'Invalid target user ID format',
      });
    }

    const targetUser = await userRepo.findOne({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return resp.status(404).json({
        errorCode: 'auth.switch.invalidUser',
        message: 'Target user not found',
      });
    }

    if (targetUser.id !== adultUser.id) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adultId: adultUser.id,
          childId: targetUser.id
        }
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'auth.switch.notRelated',
          message: 'No relationship exists between these users',
        });
      }
    }

    const isAdult = (targetUser.type === UserType.PARENT || targetUser.type === UserType.TEACHER);
    const pinRequired = targetUser.pinRequired || isAdult;
    const defaultPin = "4000";

    // Adults can switch to their children without requiring a PIN, but only if they're currently acting as themselves
    const isAdultActingAsSelf = !req.jwtUser.selectedUserId || req.jwtUser.selectedUserId === adultUser.id;
    const isAdultSwitchingToChild = isAdultActingAsSelf && (targetUser.type === UserType.STUDENT);

    if (pinRequired && !isAdultSwitchingToChild) {
      if (!req.body.pin) {
        return resp.status(401).json({
          errorCode: 'auth.switch.invalidPin',
          message: 'PIN is required to access this account',
        });
      }

      const expectedPin = (isAdult && !targetUser.pin) ? defaultPin : targetUser.pin;

      if (req.body.pin !== expectedPin) {
        return resp.status(401).json({
          errorCode: 'auth.switch.invalidPin',
          message: 'Incorrect PIN',
        });
      }
    }

    const jwtUser: JWTUser = {
      email: req.jwtUser.email,
      selectedUserId: targetUser.id
    };

    const token = jwt.sign(jwtUser, env['JWT_SIGNING_KEY']!);
    const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
    resp.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: ONE_YEAR,
    });

    return resp.json({
      success: true
    });
  });
};