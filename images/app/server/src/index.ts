import express from 'express';
import proxy from 'express-http-proxy';
import path from 'path';

type R = express.Request<{}, {}, {}, {text: string}>;

const app = express();

app.use('/static', express.static(path.join(__dirname, '../../static')));

app.get('/', (req, resp) => {
  resp.sendFile(path.join(__dirname, '../../static/index.html'));
});

app.get('/api/tts', async (req: R, resp, next) => {
  return proxy(
    'http://pstts:5002/api/tts?text=' + encodeURIComponent(req.query.text)
  )(req, resp, next);
});

app.get('/modules/*', (req, resp) => {
  resp.sendFile(path.join(__dirname, '../../static/index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
