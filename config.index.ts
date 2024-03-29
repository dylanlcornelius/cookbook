import { writeFile } from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
  title: 'The Cookbook',
  production: true,
  firebase: {
    apiKey: '${process.env.FIREBASE_TOKEN}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${process.env.FIREBASE_DB_URL}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

writeFile(targetPath, envConfigFile, 'utf8', error => {
  if (error) {
    return console.log(error);
  }
});
