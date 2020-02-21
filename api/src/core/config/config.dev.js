import path from "path";

export default {
  logFileDir: path.join(__dirname, '../../log'),
  logFileName: 'app.log',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '8080',
  dbName: process.env.DB_NAME || 'test',
  orientHost: process.env.ORIENT_HOST || 'localhost',
  orientUsername: process.env.ORIENT_USERNAME || 'root',
  orientPass: process.env.ORIENT_PASS || 'root',
  orientDb: process.env.ORIENT_DB || 'Spike',
  serverPort: process.env.PORT || 4000,
};