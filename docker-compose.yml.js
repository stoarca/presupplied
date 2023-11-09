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
        context: path.join(__dirname, 'images/psapp/'),
      },
      labels: [
        'traefik.enable=true',
        `traefik.http.routers.psapprouter.rule=Host("${host}")`,
        'traefik.http.routers.psapprouter.entrypoints=web',
        'traefik.http.services.psappservice.loadbalancer.server.port=8080',
        `traefik.http.routers.psapprouter-secure.rule=Host("${host}")`,
        'traefik.http.routers.psapprouter-secure.entrypoints=websecure',
        'traefik.http.routers.psapprouter-secure.tls=true',
        'traefik.http.middlewares.psapp-redirect.redirectscheme.scheme=https',
        'traefik.http.routers.psapprouter.middlewares=psapp-redirect',
      ].concat(DEV ? [
      ] : [
        'traefik.http.routers.psapprouter-secure.tls.certresolver=myresolver',
      ]),
      restart: 'always',
      volumes: [
        '/data/presupplied/training_data:/training_data',
      ].concat(DEV ? [
        `${path.join(__dirname, './images/psapp')}:/presupplied/images/psapp`,
      ] : []),
      environment: {
        NODE_ENV: DEV ? 'development' : 'production',
        POSTGRES_CONNECTION_HOST: 'pspostgres',
        POSTGRES_CONNECTION_DB: 'presupplied',
        POSTGRES_CONNECTION_USER: 'presupplied',
        POSTGRES_CONNECTION_PASSWORD: secrets.POSTGRES_SUBUSER_PASSWORD,
        JWT_SIGNING_KEY: secrets.JWT_SIGNING_KEY,
      }
    },
    pstts: {
      build: {
        context: path.join(__dirname, 'images/pstts/'),
      },
      restart: 'always',
      volumes: [
        '/data/presupplied/pstts/models:/tts_models',
      ].concat(DEV ? [
        `${path.join(__dirname, './images/pstts')}:/presupplied/images/pstts`,
      ] : []),
      environment: {
        MODE: DEV ? 'development' : 'production',
      }
    },
    pspostgres: {
      build: {
        context: path.join(__dirname, 'images/pspostgres/'),
      },
      restart: 'always',
      volumes: [
        '/data/presupplied/pspostgres/data:/var/lib/postgresql/data',
      ],
      shm_size: '2gb',
      environment: {
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: secrets.POSTGRES_MASTER_PASSWORD,
        POSTGRES_SUBDB: 'presupplied',
        POSTGRES_SUBUSER: 'presupplied',
        POSTGRES_SUBUSER_PASSWORD: secrets.POSTGRES_SUBUSER_PASSWORD,
      },
    },
    psingress: {
      build: {
        context: path.join(__dirname, 'images/psingress/'),
      },
      restart: 'always',
      ports: [
        '80:80',
        '443:443',
        '8080:8080',
      ],
      volumes: [
        '/var/run/docker.sock:/var/run/docker.sock:ro',
        '/data/presupplied/ingress/letsencrypt:/letsencrypt',
      ].concat(DEV ? [
        `${path.join(__dirname, './images/psingress/certs')}:/certs`,
        `${path.join(__dirname, './images/psingress/certs-traefik.yml')}:/etc/traefik/dynamic/certs-traefik.yml`,
      ] : []),
      command: [
        '--providers.docker=true',
        '--providers.docker.exposedbydefault=false',
        '--entrypoints.web.address=:80',
        '--entrypoints.websecure.address=:443',
      ].concat(DEV ? [
        '--log.level=DEBUG',
        '--api.insecure=true',
        '--providers.file.directory=/etc/traefik/dynamic',
      ] : [
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
