import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import proxy from 'express-http-proxy';
import path from 'path';

import { AppDataSource } from './data-source';
import { Student } from './entity/Student';
import { Module } from './entity/Module';
import { env } from './env';
import _KNOWLEDGE_MAP from '../../static/knowledge-map.json';
import { GraphNode, GraphJson, StudentDTO } from '../../common/types';

let KNOWLEDGE_MAP = _KNOWLEDGE_MAP as GraphJson;

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
    process.exit(1);
  }
};

AppDataSource.initialize().then(async () => {
  await syncKnowledgeMapIdsToDb();
  const app = express();
  app.use(express.json());
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

  type TTSRequest = express.Request<{}, {}, {}, {text: string}>;
  app.get('/api/tts', async (req: TTSRequest, resp, next) => {
    return proxy(
      'http://pstts:5002/api/tts?text=' + encodeURIComponent(req.query.text)
    )(req, resp, next);
  });

  app.post('/api/auth/login', async (req, resp, next) => {
    let studentRepo = AppDataSource.getRepository(Student);
    let student = await studentRepo.findOneBy({ email: req.body.email });
    if (!student) {
      return resp.status(422).json({
        errorCode: 'auth.login.email.nonexistent',
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

  app.post('/api/auth/register', async (req, resp, next) => {
    if (!isValidEmail(req.body.email)) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.invalid',
        message: 'Email is invalid',
      });
    }

    let studentRepo = AppDataSource.getRepository(Student);
    let student = await studentRepo.findOneBy({ email: req.body.email });
    if (student) {
      return resp.status(422).json({
        errorCode: 'auth.register.email.invalid',
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

  app.get('/api/student', async (
    req, resp: express.Response<{student: StudentDTO | null}>, next
  ) => {
    console.log('getting the student');
    console.log(req.jwtStudent);
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
    console.log('got here');
    console.log(student);
    console.log(student.progress);
    return resp.json({
      student: {
        name: student.name,
        email: student.email,
        progress: student.progress.map(x => ({
          module: x.module.vanityId,
          status: x.status,
        })),
      }
    });
  });

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}).catch(error => console.log(error))

