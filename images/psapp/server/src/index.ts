import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import proxy from 'express-http-proxy';
import path from 'path';
import { In } from 'typeorm';

import { AppDataSource } from './data-source';
import { Student } from './entity/Student';
import { StudentProgress } from './entity/StudentProgress';
import { Module } from './entity/Module';
import { env } from './env';
import {
  GraphNode, GraphJson, StudentProgressDTO, KNOWLEDGE_MAP
} from '../../common/types';
import { EndpointKeys, endpoints, Endpoints } from '../../common/apitypes';

if (endpoints) {
  // HACK: if we only import types, ts-node doesn't typecheck the file
  // so we have to use the varibale somehow. We use it in the condition and
  // intentionally do nothing
}

interface JWTStudent {
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      jwtStudent: JWTStudent | null;
    }
  }
}

const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return regex.test(email);
};

let setLoginCookie = (req: express.Request, resp: express.Response) => {
  let jwtUser: JWTStudent = {
    email: req.body.email,
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
    req.jwtStudent = null;
    if (req.cookies['authToken']) {
      req.jwtStudent = jwt.verify(
        req.cookies['authToken'], env['JWT_SIGNING_KEY']!
      ) as JWTStudent;
      console.log(req.jwtStudent);
    }
    next();
  });

  type RouteHandler<K extends EndpointKeys> = (
    req: express.Request<
      Endpoints[K]['Params'],
      Endpoints[K]['Response'],
      Endpoints[K]['Body'],
      Endpoints[K]['Query']
    >,
    resp: express.Response<Endpoints[K]['Response']>,
    next: express.NextFunction,
  ) => void;

  let typedGet = <K extends EndpointKeys>(
    endpointKey: Endpoints[K]['method'] extends 'get' ?
      K : [K, 'does not impelement get method', never],
    handler: RouteHandler<K>
  ) => {
    app.get(endpointKey, handler);
  };

  let typedPost = <K extends EndpointKeys>(
    endpointKey: Endpoints[K]['method'] extends 'post' ?
      K : [K, 'does not implement post method', never],
    handler: RouteHandler<K>
  ) => {
    app.post(endpointKey, handler);
  };

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

  app.get('/login', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.get('/register', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  app.get('/modules/*', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../static/index.html'));
  });

  typedGet('/api/tts', async (req, resp, next) => {
    return proxy(
      'http://pstts:5002/api/tts?text=' + encodeURIComponent(req.query.text)
    )(req, resp, next);
  });

  typedPost('/api/auth/register', async (req, resp, next) => {
    if (!isValidEmail(req.body.email)) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.invalid',
        email: req.body.email,
        message: 'Email is invalid',
      });
    }

    let studentRepo = AppDataSource.getRepository(Student);
    let student = await studentRepo.findOneBy({ email: req.body.email });
    if (student) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.alreadyRegistered',
        email: req.body.email,
        message: 'Email already registered',
      });
    }

    await studentRepo.insert({
      name: req.body.name,
      email: req.body.email,
      hashed: await bcrypt.hash(req.body.password, 12),
    });

    setLoginCookie(req, resp);
    resp.json({success: true});
  });

  typedPost('/api/auth/login', async (req, resp, next) => {
    let studentRepo = AppDataSource.getRepository(Student);
    let student = await studentRepo.findOneBy({ email: req.body.email });
    if (!student) {
      return resp.status(422).json({
        errorCode: 'auth.login.email.nonexistent',
        email: req.body.email,
        message: 'Email does not exist',
      });
    }

    if (!await bcrypt.compare(req.body.password, student.hashed)) {
      return resp.status(401).json({
        errorCode: 'auth.login.password.invalid',
        message: 'Password is not valid',
      });
    }

    setLoginCookie(req, resp);
    resp.json({success: true});
  });

  typedPost('/api/auth/logout', async (req, resp, next) => {
    console.log('logging out');
    clearLoginCookie(resp);
    resp.json({success: true});
  });

  typedGet('/api/student', async (req, resp) => {
    if (!req.jwtStudent) {
      return resp.json({
        student: null,
      });
    }
    let studentRepo = AppDataSource.getRepository(Student);
    let student = await studentRepo.findOne({
      where: {
        email: req.jwtStudent.email
      },
      relations: {
        progress: {
          module: true,
        }
      }
    });
    if (!student) {
      return resp.json({
        student: null,
      });
    }
    return resp.json({
      student: {
        name: student.name,
        email: student.email,
        progress: student.progress.reduce((acc, x) => {
          acc[x.module.vanityId] = {
            status: x.status,
            events: [],
          };
          return acc;
        }, {} as StudentProgressDTO),
      }
    });
  });

  typedPost('/api/learning/events', async (req, resp, next) => {
    if (!req.jwtStudent) {
      return resp.status(401).json({
        errorCode: 'learning.event.noLogin',
        message: 'You need to be logged in to save progress',
      });
    }

    let moduleIds = Object.keys(req.body.modules);
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

    let studentRepo = AppDataSource.getRepository(Student);
    let student = await studentRepo.findOneBy({ email: req.jwtStudent.email });
    if (!student) {
      return resp.status(401).json({
        errorCode: 'learning.event.noStudent',
        email: req.jwtStudent.email,
        message: 'Could not find a student with this email',
      });
    }

    let studentProgressRepo = AppDataSource.getRepository(StudentProgress);
    let notNullStudent = student;
    await studentProgressRepo.upsert(modules.map(x => {
      let events = req.body.modules[x.vanityId].events;
      let mostRecentEvent = events.sort((a, b) => b.time - a.time)[0];
      return {
        student: notNullStudent,
        module: x,
        status: mostRecentEvent.status,
      };
    }), ['student', 'module'])

    return resp.json({success: true});
  });

  let ONE_HOUR_IN_MILLISECONDS = 1000 * 60 * 60;
  let roundToPreviousDay = (timestamp: number) => {
    let date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }
  typedPost('/api/training/events', async (req, resp, next) => {
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

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}).catch(error => console.log(error))

