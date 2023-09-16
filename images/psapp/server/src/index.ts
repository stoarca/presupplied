import express from 'express';
import proxy from 'express-http-proxy';
import path from 'path';

const app = express();
app.use(express.json());

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

app.post('/api/login', async (req, resp, next) => {
  console.log(req.body);
  console.log(req.body.email);
  resp.send({success: true});
});

app.post('/api/register', async (req, resp, next) => {
  console.log(req.body);
  console.log(req.body.email);
  resp.send({success: true});
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
