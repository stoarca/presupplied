import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import proxy from 'express-http-proxy';
import path from 'path';
import { In, Like, Not } from 'typeorm';

import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { UserProgress } from './entity/UserProgress';
import { UserProgressVideo } from './entity/UserProgressVideo';
import { Module } from './entity/Module';
import { UserRelationship } from './entity/UserRelationship';
import { env } from './env';
import {
  GraphNode,
  GraphJson,
  StudentProgressDTO,
  UserDTO,
  KNOWLEDGE_MAP,
  ProgressStatus,
  ProgressVideoStatus,
  UserType,
  RelationshipType
} from '../../common/types';

// Create an efficient lookup map for modules
const moduleMap = new Map<string, GraphNode>();
KNOWLEDGE_MAP.nodes.forEach(node => {
  moduleMap.set(node.id, node);
});
import { EndpointKeys, Endpoints, verifyApiTypes } from '../../common/apitypes';
import { typedGet, typedPost } from './typedRoutes';

if (verifyApiTypes) {
  // HACK: if we only import types, ts-node doesn't typecheck the file
  // so we have to use the varibale somehow. We use it in the condition and
  // intentionally do nothing
}

const router = express.Router();

interface JWTUser {
  email: string;     // Email of the parent/teacher who logged in
  selectedUserId?: number;  // ID of the currently selected user account (parent or child)
}

declare global {
  namespace Express {
    interface Request {
      jwtUser: JWTUser | null;
    }
  }
}

const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return regex.test(email);
};

let setLoginCookie = (req: express.Request, resp: express.Response, userId?: number) => {
  let jwtUser: JWTUser = {
    email: req.body.email,
    selectedUserId: userId
  };
  let token = jwt.sign(jwtUser, env['JWT_SIGNING_KEY']!);

  let ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
  resp.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: ONE_YEAR,
  });
};

let clearLoginCookie = (resp: express.Response) => {
  resp.clearCookie('authToken');
};

let syncKnowledgeMapIdsToDb = async () => {
  let moduleRepo = AppDataSource.getRepository(Module);
  let knowledgeMapModuleIds = KNOWLEDGE_MAP.nodes.map(x => x.id).sort();
  let dbModuleIds = (await AppDataSource.getRepository(Module)
      .createQueryBuilder('module')
      .select(['module.vanityId'])
      .getMany()
  ).map(x => x.vanityId).sort();
  let i = 0;
  let j = 0;
  let idsToInsert = [];
  let idsToRemove = [];
  while (i < knowledgeMapModuleIds.length || j < dbModuleIds.length) {
    let kmId = knowledgeMapModuleIds[i];
    let dbId = dbModuleIds[j];
    if (i === knowledgeMapModuleIds.length) {
      idsToRemove.push(dbId);
      j += 1;
    } else if (j === dbModuleIds.length) {
      idsToInsert.push(kmId);
      i += 1;
    } else if (kmId === dbId) {
      i += 1;
      j += 1;
    } else if (kmId < dbId) {
      idsToInsert.push(kmId);
      i += 1;
    } else { // dbId < kmId
      idsToRemove.push(dbId);
      j += 1;
    }
  }
  await AppDataSource.getRepository(Module)
      .createQueryBuilder('module')
      .insert()
      .into(Module)
      .values(idsToInsert.map(x => ({vanityId: x})))
      .execute();

  if (idsToRemove.length) {
    console.error('Old modules found in db!');
    console.error(idsToRemove);
  }
};

AppDataSource.initialize().then(async () => {
  await syncKnowledgeMapIdsToDb();
  const app = express();
  app.use(express.json({limit: '1000kb'}));
  app.use(cookieParser());
  app.use((req, resp, next) => {
    req.jwtUser = null;
    if (req.cookies['authToken']) {
      req.jwtUser = jwt.verify(
        req.cookies['authToken'], env['JWT_SIGNING_KEY']!
      ) as JWTUser;
      console.log(req.jwtUser);
    }
    next();
  });

  let threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
  app.use('/static/dist/wav', express.static(
    path.join(__dirname, '../../static/dist/wav'),
    {
      maxAge: threeDaysInMilliseconds,
      immutable: true,
    },
  ));
  app.use('/static', express.static(path.join(__dirname, '../../static')));

  app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.get('/map', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.get('/login', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.get('/register', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.get('/debug', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.get('/modules/*', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.use('/', router);

  typedGet(router, '/api/tts', async (req, resp, next) => {
    return proxy(
      'http://pstts:5002/api/tts?text=' + encodeURIComponent(req.query.text)
    )(req, resp, next);
  });

  typedPost(router, '/api/auth/register', async (req, resp, next) => {
    if (!isValidEmail(req.body.email)) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.invalid',
        email: req.body.email,
        message: 'Email is invalid',
      });
    }

    let userRepo = AppDataSource.getRepository(User);
    let user = await userRepo.findOneBy({ email: req.body.email });
    if (user) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.alreadyRegistered',
        email: req.body.email,
        message: 'Email already registered',
      });
    }

    const isParentOrTeacher = (req.body.type === UserType.PARENT || req.body.type === UserType.TEACHER);
    const defaultPin = "4000";

    await userRepo.insert({
      name: req.body.name,
      email: req.body.email,
      hashed: await bcrypt.hash(req.body.password, 12),
      type: req.body.type,
      pin: isParentOrTeacher ? defaultPin : undefined,
      pinRequired: isParentOrTeacher
    });

    setLoginCookie(req, resp);
    resp.json({success: true});
  });

  typedPost(router, '/api/auth/login', async (req, resp, next) => {
    let userRepo = AppDataSource.getRepository(User);
    let user = await userRepo.findOneBy({ email: req.body.email });
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

  typedPost(router, '/api/user/children', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'user.children.notLoggedIn',
        message: 'You need to be logged in to create a child account',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const parentUser = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!parentUser) {
      return resp.status(401).json({
        errorCode: 'user.children.notLoggedIn',
        message: 'Could not find the logged-in user',
      });
    }

    if (parentUser.type !== UserType.PARENT && parentUser.type !== UserType.TEACHER) {
      return resp.status(403).json({
        errorCode: 'user.children.notParentOrTeacher',
        message: 'Only parent or teacher accounts can create child accounts',
      });
    }

    try {
      const childUser = new User({
        name: req.body.name,
        type: UserType.STUDENT,
        pinRequired: req.body.pinRequired || false,
        pin: req.body.pin,
        profilePicture: req.body.profilePicture
      });

      const savedChildUser = await userRepo.save(childUser);

      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = new UserRelationship({
        adult: parentUser,
        child: savedChildUser,
        type: RelationshipType.PRIMARY
      });

      await relationshipRepo.save(relationship);

      return resp.json({
        success: true,
        childId: savedChildUser.id
      });
    } catch (error) {
      console.error('Error creating child account:', error);
      return resp.status(500).json({
        errorCode: 'user.children.creationFailed',
        message: 'Failed to create child account',
      });
    }
  });

  typedGet(router, '/api/user', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.json({ user: null });
    }

    const userRepo = AppDataSource.getRepository(User);
    const childId = req.jwtUser.selectedUserId;
    let selectedUser;

    if (childId) {
      const parentUser = await userRepo.findOne({
        where: { email: req.jwtUser.email }
      });

      if (!parentUser) {
        return resp.json({ user: null });
      }

      if (childId === parentUser.id) {
        selectedUser = await userRepo.findOne({
          where: { id: parentUser.id },
          relations: { progress: { module: true } }
        });
      } else {
        const relationshipRepo = AppDataSource.getRepository(UserRelationship);
        const relationship = await relationshipRepo.findOne({
          where: {
            adult: { id: parentUser.id },
            child: { id: childId }
          }
        });

        if (!relationship) {
          clearLoginCookie(resp);
          return resp.json({ user: null });
        }

        selectedUser = await userRepo.findOne({
          where: { id: childId },
          relations: { progress: { module: true } }
        });
      }
    } else {
      selectedUser = await userRepo.findOne({
        where: { email: req.jwtUser.email },
        relations: { progress: { module: true } }
      });
    }

    if (!selectedUser) {
      return resp.json({ user: null });
    }

    // Create the base user DTO
    let userDTO: UserDTO = {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email || '',
      type: selectedUser.type,
      profilePicture: selectedUser.profilePicture,
      progress: selectedUser.progress.reduce((acc, x) => {
        acc[x.module.vanityId] = {
          status: x.status,
          events: [],
        };
        return acc;
      }, {} as StudentProgressDTO),
    };

    // If this is a parent or teacher account, include children information
    if (selectedUser.type === UserType.PARENT || selectedUser.type === UserType.TEACHER) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const childRelationships = await relationshipRepo.find({
        where: {
          adult: { id: selectedUser.id }
        },
        relations: ['child']
      });

      if (childRelationships.length > 0) {
        userDTO.children = childRelationships.map(rel => ({
          id: rel.child.id,
          name: rel.child.name,
          profilePicture: rel.child.profilePicture,
          pinRequired: rel.child.pinRequired
        }));
      }
    }

    // If this is a student account, include parent/teacher information
    if (selectedUser.type === UserType.STUDENT) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const parentRelationships = await relationshipRepo.find({
        where: {
          child: { id: selectedUser.id }
        },
        relations: ['adult']
      });

      if (parentRelationships.length > 0) {
        userDTO.parents = parentRelationships.map(rel => {
          const isLoggedInParent = childId &&
            req.jwtUser &&
            req.jwtUser.email === rel.adult.email;

          return {
            id: rel.adult.id,
            name: rel.adult.name,
            type: rel.adult.type,
            profilePicture: rel.adult.profilePicture,
            relationshipType: rel.type,
            loggedIn: !!isLoggedInParent
          };
        });

        if (childId && req.jwtUser) {
          const loggedInParent = parentRelationships.find(rel => 
            rel.adult.email === req.jwtUser!.email
          );
          
          if (loggedInParent) {
            const classmateRelationships = await relationshipRepo.find({
              where: {
                adult: { id: loggedInParent.adult.id },
                child: { id: Not(selectedUser.id) }
              },
              relations: ['child']
            });

            if (classmateRelationships.length > 0) {
              userDTO.classmates = classmateRelationships.map(rel => ({
                id: rel.child.id,
                name: rel.child.name,
                profilePicture: rel.child.profilePicture,
                pinRequired: rel.child.pinRequired
              }));
            }
          }
        }
      }
    }

    return resp.json({ user: userDTO });
  });


  typedPost(router, '/api/user/switch', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'user.switch.notLoggedIn',
        message: 'You need to be logged in to switch accounts',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const parentUser = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    console.log(parentUser);
    console.log(req.body.targetId);

    if (!parentUser) {
      return resp.status(401).json({
        errorCode: 'user.switch.notLoggedIn',
        message: 'Could not find the logged-in user',
      });
    }


    if (parentUser.type !== UserType.PARENT && parentUser.type !== UserType.TEACHER) {
      return resp.status(403).json({
        errorCode: 'user.switch.notParentOrTeacher',
        message: 'Only parent or teacher accounts can switch to child accounts',
      });
    }

    const targetUserId = parseInt(req.body.targetId);
    if (isNaN(targetUserId)) {
      return resp.status(400).json({
        errorCode: 'user.switch.invalidUser',
        message: 'Invalid target user ID format',
      });
    }

    const targetUser = await userRepo.findOne({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return resp.status(404).json({
        errorCode: 'user.switch.invalidUser',
        message: 'Target user not found',
      });
    }

    // If switching to own account (parent → parent), no relationship check needed
    if (targetUser.id !== parentUser.id) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adult: { id: parentUser.id },
          child: { id: targetUser.id }
        }
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'user.switch.notRelated',
          message: 'No relationship exists between these users',
        });
      }
    }

    // Check if PIN is required for the target account, or if it's a parent/teacher account
    const isParentOrTeacher = (targetUser.type === UserType.PARENT || targetUser.type === UserType.TEACHER);
    const pinRequired = targetUser.pinRequired || isParentOrTeacher;
    const defaultPin = "4000";

    if (pinRequired) {
      if (!req.body.pin) {
        return resp.status(401).json({
          errorCode: 'user.switch.invalidPin',
          message: 'PIN is required to access this account',
        });
      }

      // Use default PIN "4000" for parent/teacher accounts if PIN is not set
      const expectedPin = (isParentOrTeacher && !targetUser.pin) ? defaultPin : targetUser.pin;

      if (req.body.pin !== expectedPin) {
        return resp.status(401).json({
          errorCode: 'user.switch.invalidPin',
          message: 'Incorrect PIN',
        });
      }
    }

    let jwtUser: JWTUser = {
      email: req.jwtUser.email,
      selectedUserId: targetUser.id
    };

    let token = jwt.sign(jwtUser, env['JWT_SIGNING_KEY']!);
    let ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
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

  typedGet(router, '/api/learning/progressvideos/:kmid', async (req, resp, next) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'learning.progressvideos.noLogin',
        message: 'You need to be logged in get video progress',
      });
    }

    let userRepo = AppDataSource.getRepository(User);
    let user = await userRepo.findOneBy({ email: req.jwtUser.email });
    if (!user) {
      return resp.status(401).json({
        errorCode: 'learning.progressvideos.noStudent',
        email: req.jwtUser.email,
        message: 'Could not find a user with this email',
      });
    }

    let moduleRepo = AppDataSource.getRepository(Module);
    let module = await moduleRepo.findOneBy({
      vanityId: req.params.kmid,
    });
    if (!module) {
      return resp.status(400).json({
        errorCode: 'learning.progressvideos.noModule',
        moduleVanityId: req.params.kmid,
        message: 'Could not find a student with this email',
      });
    }

    let userProgressRepo = AppDataSource.getRepository(UserProgress);
    let notNullUser = user;
    let notNullModule = module;
    let userProgress = await userProgressRepo.findOneBy({
      user: { id: notNullUser.id },
      module: { id: notNullModule.id },
    });

    if (!userProgress) {
      return resp.json({
        success: true,
        videos: {},
      });
    }

    let userProgressVideoRepo = AppDataSource.getRepository(
      UserProgressVideo
    );
    let userProgressVideos = await userProgressVideoRepo.findBy({
      userProgress: { id: userProgress.id },
    });

    let videos: Record<string, ProgressVideoStatus> = {};
    userProgressVideos.forEach(x => {
      videos[x.videoVanityId] = x.status;
    });
    return resp.json({
      success: true,
      videos: videos,
    });
  });

  typedPost(router, '/api/learning/events', async (req, resp, next) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'learning.event.noLogin',
        message: 'You need to be logged in to save progress',
      });
    }

    let moduleIds = Object.keys(
      req.body.type === 'module' ? req.body.modules : req.body.moduleVideos
    );

    // Verify that onBehalfOfStudentId is set for modules that require it
    if (req.body.type === 'module') {
      for (const moduleId of moduleIds) {
        const moduleData = moduleMap.get(moduleId);
        if (moduleData?.forTeachers && moduleData?.onBehalfOfStudent && !req.body.onBehalfOfStudentId) {
          return resp.status(400).json({
            errorCode: 'learning.event.missingStudentId',
            message: `Module ${moduleId} requires onBehalfOfStudentId parameter`,
            moduleId: moduleId
          });
        }
      }
    }
    let moduleRepo = AppDataSource.getRepository(Module);
    let modules = await moduleRepo.findBy({
      vanityId: In(moduleIds),
    });
    if (moduleIds.length !== modules.length) {
      let requestedModuleIdSet = new Set(moduleIds);
      let retrievedModuleIdSet = new Set(modules.map(x => x.vanityId));
      for (let id of retrievedModuleIdSet) {
        requestedModuleIdSet.delete(id);
      }
      return resp.status(422).json({
        errorCode: 'learning.event.invalidModules',
        moduleVanityIds: Array.from(requestedModuleIdSet),
        message: 'Could not find the requested learning modules',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const baseUser = await userRepo.findOneBy({ email: req.jwtUser.email });
    if (!baseUser) {
      return resp.status(401).json({
        errorCode: 'learning.event.noUser',
        message: 'Could not find the authenticated user',
      });
    }

    let targetUser = baseUser;

    // Error if both selectedUserId and onBehalfOfStudentId are provided
    if (req.jwtUser.selectedUserId &&
        req.jwtUser.selectedUserId !== baseUser.id &&
        req.body.onBehalfOfStudentId) {
      return resp.status(403).json({
        errorCode: 'learning.event.unauthorized',
        message: 'A student account cannot modify progress for another student',
      });
    }

    if (req.jwtUser.selectedUserId && req.jwtUser.selectedUserId !== baseUser.id) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adult: { id: baseUser.id },
          child: { id: req.jwtUser.selectedUserId }
        },
        relations: ['child']
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'learning.event.unauthorized',
          message: 'No relationship exists with the selected user',
        });
      }

      targetUser = relationship.child;
    }

    if (req.body.onBehalfOfStudentId) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adult: { id: baseUser.id },
          child: { id: req.body.onBehalfOfStudentId }
        },
        relations: ['child']
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'learning.event.unauthorized',
          message: 'No relationship exists with the specified student',
        });
      }

      targetUser = relationship.child;
    }

    const userProgressRepo = AppDataSource.getRepository(UserProgress);
    if (req.body.type === 'module') {
      let body = req.body;
      await userProgressRepo.upsert(modules.map(x => {
        let events = body.modules[x.vanityId].events;
        let mostRecentEvent = events.sort((a, b) => b.time - a.time)[0];
        return {
          user: targetUser,
          module: x,
          status: mostRecentEvent.status,
        };
      }), ['user', 'module'])
    } else {
      try {
        await userProgressRepo.insert(modules.map(x => {
          return {
            user: targetUser,
            module: x,
            status: ProgressStatus.NOT_ATTEMPTED,
          };
        }));
      } catch (e) {
        if ((e as Error).message.includes('duplicate key value')) {
          // row will alrady exist when we're watching a video on a module
          // we've attempted before. Ignore this.
        } else {
          throw e;
        }
      }

      let userProgresses = await userProgressRepo.find({
        where: {
          user: { id: targetUser.id },
          module: { id: In(modules.map(x => x.id)) },
        },
        relations: {
          module: true,
        },
      });
      let userProgressMap: Record<string, UserProgress> = {};
      userProgresses.forEach((x) => {
        userProgressMap[x.module.vanityId] = x;
      });
      let userProgressVideoRepo = AppDataSource.getRepository(
        UserProgressVideo
      );
      let inserts = [];
      for (let kmid in req.body.moduleVideos) {
        for (let videoVanityId in req.body.moduleVideos[kmid]) {
          inserts.push({
            userProgress: userProgressMap[kmid],
            videoVanityId: videoVanityId,
            status: req.body.moduleVideos[kmid][videoVanityId],
          });
        }
      }
      await userProgressVideoRepo.upsert(
        inserts,
        ['userProgress', 'videoVanityId']
      );
    }

    return resp.json({success: true});
  });

  let ONE_HOUR_IN_MILLISECONDS = 1000 * 60 * 60;
  let roundToPreviousDay = (timestamp: number) => {
    let date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }
  typedPost(router, '/api/training/events', async (req, resp, next) => {
    let date = parseInt(req.body.id.split('-')[0]);
    if (Date.now() - date > ONE_HOUR_IN_MILLISECONDS) {
      return resp.status(410).json({
        errorCode: 'training.events.tooLate',
        message: 'The request was sent too late',
      });
    }

    let previousDay = roundToPreviousDay(date);
    let dir = path.join('/training_data/', previousDay.toString(), req.body.id);
    await fs.mkdir(dir, {recursive: true});
    let seqId = req.body.sequenceId.toString().padStart(4, '0');

    let wavChunk = new Buffer(req.body.webmSoundB64, 'base64');
    await fs.writeFile(
      path.join(dir, seqId + '.webmpart'),
      wavChunk
    );
    await fs.writeFile(
      path.join(dir, seqId + '.chunks'),
      JSON.stringify(req.body.events, undefined, 2)
    );

    return resp.json({success: true});
  });

  typedPost(router, '/api/test/get-user-info', async (req, resp, next) => {
    const { email } = req.body;
    
    if (!email.startsWith('ps-test-account-')) {
      return resp.status(403).json({
        errorCode: 'test.notTestAccount',
        message: 'This endpoint only works with test accounts (prefix: ps-test-account-)',
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
      relations: ['children'],
    });

    if (!user) {
      return resp.status(404).json({
        errorCode: 'test.userNotFound',
        message: 'User not found',
      });
    }

    const dto = {
      id: user.id,
      name: user.name,
      email: user.email || '',
      type: user.type,
      profilePicture: user.profilePicture,
      progress: {},
    };
    return resp.json({
      success: true,
      user: dto,
      children: user.children?.map(child => ({
        id: child.id,
        name: child.name,
        email: child.email || '',
        type: child.type,
        pinRequired: child.pinRequired,
      })),
    });
  });

  typedPost(router, '/api/test/delete-test-accounts', async (req, resp, next) => {
    const userRepository = AppDataSource.getRepository(User);
    
    const testAccounts = await userRepository.find({
      where: { email: Like('ps-test-account-%') },
    });

    let deletedCount = 0;
    if (testAccounts.length > 0) {
      await userRepository.remove(testAccounts);
      deletedCount = testAccounts.length;
    }

    return resp.json({
      success: true,
      deletedCount,
    });
  });

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}).catch(error => console.log(error))

