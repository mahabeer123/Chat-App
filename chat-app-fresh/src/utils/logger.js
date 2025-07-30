// Logger utility for structured logging
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
  }

  shouldLog(level) {
    return level <= this.level;
  }

  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level: Object.keys(LOG_LEVELS)[level],
      message,
      data,
    };
  }

  error(message, data = {}) {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      const logData = this.formatMessage(LOG_LEVELS.ERROR, message, data);
      console.error(logData);
    }
  }

  warn(message, data = {}) {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      const logData = this.formatMessage(LOG_LEVELS.WARN, message, data);
      console.warn(logData);
    }
  }

  info(message, data = {}) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      const logData = this.formatMessage(LOG_LEVELS.INFO, message, data);
      console.info(logData);
    }
  }

  debug(message, data = {}) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const logData = this.formatMessage(LOG_LEVELS.DEBUG, message, data);
      console.log(logData);
    }
  }
}

export const logger = new Logger(); 