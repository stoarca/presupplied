import express from 'express';
import path from 'path';

const app = express();

app.use('/static', express.static(path.join(__dirname, '../../static')));

app.get('/', (req, resp) => {
  resp.sendFile(path.join(__dirname, '../../static/index.html'));
});

app.get('/modules/*', (req, resp) => {
  resp.sendFile(path.join(__dirname, '../../static/index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
