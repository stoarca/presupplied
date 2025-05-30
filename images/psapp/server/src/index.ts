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
  UserProgressDTO,
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
import { setupAuthRoutes } from './api/auth';
import { setupChildrenRoutes } from './api/children';
import { setupLearningRoutes } from './api/learning';
import { setupTrainingRoutes } from './api/training';
import { setupUserRoutes } from './api/user';
import { setupInvitationRoutes } from './api/invitations';
import { setupTestRoutes, isTestModeEnabled } from './api/test';
import { JWTUser } from './types';

if (verifyApiTypes) {
  // HACK: if we only import types, ts-node doesn't typecheck the file
  // so we have to use the varibale somehow. We use it in the condition and
  // intentionally do nothing
}

const router = express.Router();

declare global {
  namespace Express {
    interface Request {
      jwtUser: JWTUser | null;
    }
  }
}


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

  app.get('/favicon.ico', (req, resp) => {
    resp.status(204).end();
  });

  const serveHtmlWithTestMode = async (req: express.Request, resp: express.Response) => {
    const indexPath = path.join(__dirname, '../../static/index.html');
    
    if (isTestModeEnabled) {
      const content = await fs.readFile(indexPath, 'utf8');
      const injectedContent = content.replace(
        '</head>',
        '<script>window.__TEST_MODE__ = true;</script></head>'
      );
      resp.send(injectedContent);
    } else {
      resp.sendFile(indexPath);
    }
  };

  app.get('/', serveHtmlWithTestMode);
  app.get('/map', serveHtmlWithTestMode);
  app.get('/login', serveHtmlWithTestMode);
  app.get('/register', serveHtmlWithTestMode);
  app.get('/debug', serveHtmlWithTestMode);
  app.get('/settings', serveHtmlWithTestMode);
  app.get('/settings/general', serveHtmlWithTestMode);
  app.get('/settings/children', serveHtmlWithTestMode);
  app.get('/create-child', serveHtmlWithTestMode);
  app.get('/invitations', serveHtmlWithTestMode);
  app.get('/sync-progress', serveHtmlWithTestMode);
  app.get('/settings/*', serveHtmlWithTestMode);
  app.get('/modules/*', serveHtmlWithTestMode);

  app.use('/', router);

  setupAuthRoutes(router);
  setupChildrenRoutes(router);
  setupLearningRoutes(router);
  setupTrainingRoutes(router);
  setupUserRoutes(router);
  setupInvitationRoutes(router);
  setupTestRoutes(router);

  typedGet(router, '/api/tts', async (req, resp, next) => {
    return proxy(
      'http://pstts:5002/api/tts?text=' + encodeURIComponent(req.query.text)
    )(req, resp, next);
  });

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}).catch(error => console.log(error))

