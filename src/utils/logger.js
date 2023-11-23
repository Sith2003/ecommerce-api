const winston = require('winston');
const moment = require("moment");
const DailyRotateFile = require('winston-daily-rotate-file');

const { combine, json, timestamp } = winston.format
const defaultFormat = combine(timestamp({format: 'YYYY-MM-DD-HH:mm:ss'}),json())
const LOG_PATH = `${process.cwd()}/src/logs`

const generateWinstonRotateConfig = (level) => {
  let fileName = `${LOG_PATH}/e-commerce-%DATE%.log`
  if (level === 'error') {
    fileName = `${LOG_PATH}/e-commerce-error-%DATE%.log`
  }

  return new DailyRotateFile({
    filename: fileName,
    datePattern: 'YYYY-MM-DD',
    maxSize: '10m',
    level
  })
}

const fileTransports = [
  generateWinstonRotateConfig('debug'),
  generateWinstonRotateConfig('error')
]

const logger = winston.createLogger({
  level: 'debug',
  format: defaultFormat,
  defaultMeta: { service: 'e-commerce' },
  transports: [],
});

if (process.env.NODE_ENV !== 'DEVELOPMENT') {
  fileTransports.forEach((t) => logger.add(t))
}
  
if (process.env.NODE_ENV !== 'PRODUCTION') {
  logger.add(new winston.transports.Console({
  format: defaultFormat,
  }));
}

const gatewayLogger = (request, response) => {
  const requestStart = Date.now();

  response.on("finish", () => {
    const { rawHeaders, httpVersion, method, socket, url, body } = request;
    const { remoteAddress, remoteFamily } = socket;

    const { statusCode, statusMessage } = response;
    const headers = response.getHeaders();

    const message = JSON.stringify({
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      processingTime: Date.now() - requestStart,
      rawHeaders,
      body,
      httpVersion,
      method,
      remoteAddress,
      remoteFamily,
      url,
      response: {
        statusCode,
        statusMessage,
        headers,
      },
    });

    // Error logs OR info logs
    if (statusCode >= 300) {
      logger.log({
        level: "error",
        massage: message,
      });
    } else {
      logger.log({
        level: "info",
        massage: message,
      });
    }
  });
};

module.exports = { logger, gatewayLogger } 
