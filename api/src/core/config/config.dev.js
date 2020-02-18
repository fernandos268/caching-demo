import path from "path";

export default {
  logFileDir: path.join(__dirname, '../../log'),
  logFileName: 'app.log',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '8080',
  dbName: process.env.DB_NAME || 'test',
  serverPort: process.env.PORT || 4000,

};