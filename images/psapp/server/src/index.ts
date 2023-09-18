import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import proxy from 'express-http-proxy';
import path from 'path';

import { AppDataSource } from './data-source'
import { Student } from './entity/Student'
import { env } from './env';

const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return regex.test(email);
};

let setLoginCookie = (req: express.Request, resp: express.Response) => {
  let token = jwt.sign({
    email: req.body.email,
  }, env['JWT_SIGNING_KEY']!);

  let ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
  resp.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: ONE_YEAR,
  });
};

AppDataSource.initialize().then(async () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

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

  app.get('/api/user', async (req, resp, next) => {
    let loginInfo = jwt.verify(
      req.cookies['authToken'], env['JWT_SIGNING_KEY']!
    );
    console.log('getting the user');
    console.log(loginInfo);
    resp.json({success: true});
  });

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}).catch(error => console.log(error))

