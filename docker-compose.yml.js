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
        context: path.join(__dirname, 'images/app/'),
      },
      labels: [
        'traefik.enable=true',
        `traefik.http.routers.psapprouter.rule=Host("${host}")`,
        'traefik.http.routers.psapprouter.entrypoints=web',
        'traefik.http.services.psappservice.loadbalancer.server.port=8080',
      ].concat(DEV ? [
      ] : [
        `traefik.http.routers.psapprouter-secure.rule=Host("${host}")`,
        'traefik.http.routers.psapprouter-secure.entrypoints=websecure',
        'traefik.http.routers.psapprouter-secure.tls=true',
        'traefik.http.routers.psapprouter-secure.tls.certresolver=myresolver',
        'traefik.http.middlewares.psapp-redirect.redirectscheme.scheme=https',
        'traefik.http.routers.psapprouter.middlewares=psapp-redirect',
      ]),
      restart: 'always',
      volumes: [
      ].concat(DEV ? [
        `${path.join(__dirname, './images/app')}:/presupplied/images/app`,
      ] : []),
      environment: {
        NODE_ENV: DEV ? 'development' : 'production',
      }
    },
    pstts: {
      build: {
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
    psingress: {
      image: 'traefik:2.10',
      restart: 'always',
      ports: [
        '80:80',
        '443:443',
        '8080:8080',
      ],
      volumes: [
        '/var/run/docker.sock:/var/run/docker.sock:ro',
        '/data/presupplied/ingress/letsencrypt:/letsencrypt',
      ],
      command: [
        '--providers.docker=true',
        '--providers.docker.exposedbydefault=false',
        '--entrypoints.web.address=:80',
      ].concat(DEV ? [
        '--log.level=DEBUG',
        '--api.insecure=true',
      ] : [
        '--entrypoints.websecure.address=:443',
        '--certificatesresolvers.myresolver.acme.tlschallenge=true',
        '--certificatesresolvers.myresolver.acme.email=t.sergiu@gmail.com',
        '--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json',
      ]),
    },
  },
  networks: {
    default: {
      // HACK: to get the presupplied_website to work with traefik
      name: 'presupplied',
    },
  },
};

console.log(JSON.stringify(config, undefined, 2));
