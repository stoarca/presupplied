let fs = require('fs');
let path = require('path');

if (process.argv.length < 3) {
  console.error('Must provide argument of either "dev" or "prod"');
  process.exit(1);
}
let MODE = process.argv[2];
if (!['dev', 'prod'].includes(MODE)) {
  console.error('Must provide argument of either "dev" or "prod"');
  process.exit(1);
}

let DEV = MODE === 'dev';
let PROD = MODE === 'prod';

let secrets;
if (DEV) {
  secrets = require('./secrets.dev.json');
} else {
  secrets = require('./secrets.prod.json');
}
secrets = new Proxy(secrets, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      throw new Error(`Environment variable '${prop}' not found`);
    }
  }
});

let host = DEV ? 'applocal.presupplied.com' : 'app.presupplied.com';
let scheme = DEV ? 'http://' : 'https://';
let webUrl = scheme + host;

let config = {
  version: '3.1',
  services: {
    psapp: {
      build: {
        dockerfile: path.join(__dirname, 'images/app/Dockerfile'),
        context: path.join(__dirname, 'images/app/'),
      },
      restart: 'always',
      volumes: [
      ].concat(DEV ? [
        `${path.join(__dirname, './images/app')}:/presupplied/images/app`,
      ] : []),
      ports: [
        '8080:8080',
      ],
      environment: {
        NODE_ENV: DEV ? 'development' : 'production',
      }
    },
    pstts: {
      build: {
        dockerfile: path.join(__dirname, 'images/tts/Dockerfile'),
        context: path.join(__dirname, 'images/tts/'),
      },
      restart: 'always',
      volumes: [
        '/data/presupplied/tts/models:/tts_models',
      ].concat(DEV ? [
        `${path.join(__dirname, './images/tts')}:/presupplied/images/tts`,
      ] : []),
      environment: {
        MODE: DEV ? 'development' : 'production',
      }
    },
  }
};

console.log(JSON.stringify(config, undefined, 2));
