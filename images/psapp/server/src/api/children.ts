import express from 'express';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { UserRelationship } from '../entity/UserRelationship';
import {
  UserType,
  RelationshipType
} from '../../../common/types';
import { typedGet, typedPost } from '../typedRoutes';

export const setupChildrenRoutes = (router: express.Router) => {
  typedPost(router, '/api/children', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'children.create.notLoggedIn',
        message: 'You need to be logged in to create a child account',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const adultUser = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!adultUser) {
      return resp.status(401).json({
        errorCode: 'children.create.notLoggedIn',
        message: 'Could not find the logged-in user',
      });
    }

    if (adultUser.type !== UserType.PARENT && adultUser.type !== UserType.TEACHER) {
      return resp.status(403).json({
        errorCode: 'children.create.notParentOrTeacher',
        message: 'Only parent or teacher accounts can create child accounts',
      });
    }

    try {
      const childUser = new User({
        name: req.body.name,
        type: UserType.STUDENT,
        pinRequired: req.body.pinRequired || false,
        pin: req.body.pin,
        profilePicture: req.body.profilePicture,
        birthday: req.body.birthday ? new Date(req.body.birthday) : null,
        gender: req.body.gender || null
      });

      const savedChildUser = await userRepo.save(childUser);

      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = new UserRelationship();
      relationship.adultId = adultUser.id;
      relationship.childId = savedChildUser.id;
      relationship.type = RelationshipType.PRIMARY;

      await relationshipRepo.save(relationship);

      return resp.json({
        success: true,
        childId: savedChildUser.id
      });
    } catch (error) {
      console.error('Error creating child account:', error);
      return resp.status(500).json({
        errorCode: 'children.create.creationFailed',
        message: 'Failed to create child account',
      });
    }
  });

  typedGet(router, '/api/children', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'children.list.notLoggedIn',
        message: 'You need to be logged in to view children',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!user) {
      return resp.status(401).json({
        errorCode: 'children.list.userNotFound',
        message: 'Could not find the logged-in user',
      });
    }

    if (user.type !== UserType.PARENT && user.type !== UserType.TEACHER) {
      return resp.status(403).json({
        errorCode: 'children.list.notParentOrTeacher',
        message: 'Only parent or teacher accounts can view children',
      });
    }

    const relationshipRepo = AppDataSource.getRepository(UserRelationship);
    const childRelationships = await relationshipRepo.find({
      where: {
        adultId: user.id
      },
      relations: ['child']
    });

    const children = childRelationships.map(rel => ({
      id: rel.child.id,
      name: rel.child.name,
      profilePicture: rel.child.profilePicture!,
      pinRequired: rel.child.pinRequired,
      relationshipType: rel.type,
      birthday: rel.child.birthday ? rel.child.birthday.toString() : null,
      gender: rel.child.gender || null
    }));

    return resp.json({
      success: true,
      children
    });
  });
};