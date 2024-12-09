import path from "path";

const winston = require('winston');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: '%DATE%.log',
  dirname: path.join(__pkgdir, 'logs'),
  datePattern: 'YYYYMMDD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});


const logger = winston.createLogger({
  transports: [
    transport
  ]
});

export default logger;