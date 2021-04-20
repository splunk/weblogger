interface JsonValue {
  [key: string]: string | number | boolean | null | JsonValue | JsonValue[];
}

interface WebLoggerConfig {
  origin: string; // The origin of your Splunk instance.
  token: string; // The Splunk access token provided by your HEC endpoint.
  index?: string; // Overrides the default index of the HEC.
  host?: string; // Overrides the default host of the HEC.
  source?: string; // Overrides the default source of the HEC.
  sourceType?: string; // Overrides the default sourcetype of the HEC.
  bufferSize?: number; // The max size of events you want to store before sending.
  defaultMeta?: JsonValue; // Default meta data you would like to append to each event.
}

export class WebLogger {
  // Splunk Configuration
  url: string;
  index: string;
  host: string;
  source: string;
  sourceType: string;

  // Logger Configuration
  buffer: string;
  bufferSize: number;
  defaultMeta: JsonValue;

  constructor({
    origin,
    token,
    index,
    host,
    source,
    sourceType,
    bufferSize = 1024,
    defaultMeta = {},
  }: WebLoggerConfig) {
    this.url = `${origin}/services/collector/event?token=${token}`;
    this.index = index;
    this.host = host;
    this.source = source;
    this.sourceType = sourceType;

    this.buffer = "";
    this.bufferSize = bufferSize;
    this.defaultMeta = defaultMeta;

    window.addEventListener("unload", () => {
      if (this.buffer) {
        navigator.sendBeacon(this.url, this.buffer);
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
      // https://web.dev/bfcache/
      // document.addEventListener('visibilitychange', function logData() {
      // if (document.visibilityState === 'hidden') {
      //   navigator.sendBeacon('/log', analyticsData);
      // }
    });
  }

  /**
   *
   * @param  {level} string
   * @param  {Object} event
   * @returns {boolean}
   */
  log(level, event = {}) {
    const logObj = {
      index: this.index,
      host: this.host,
      source: this.source,
      sourcetype: this.sourceType,
      time: Date.now(),
      event: {
        ...this.defaultMeta,
        ...event,
        level,
      },
    };

    let logStr;
    try {
      logStr = JSON.stringify(logObj);
    } catch (err) {
      return false;
    }

    // The new event is too large to fit inside the buffer.
    if (logStr.length > this.bufferSize) {
      return navigator.sendBeacon(this.url, logStr);
    }

    // Room to store in the buffer.
    const newLength = this.buffer.length + logStr.length;
    if (newLength <= this.bufferSize) {
      this.buffer = `${this.buffer}${logStr}`;
      return true;
    }

    const result = navigator.sendBeacon(this.url, this.buffer);
    this.buffer = "";
    return result;
  }
}

export default class WebLoggerWrapper {
  /**
   * Wraps the WebLogger class with log level methods.
   * @param {Object} options
   * @param {Array} options.levels - The log levels you want to support ascending by priority.
   * @param {string} options.sendLevel - The level at which you want to start sending events to Splunk.
   * @returns {undefined}
   */
  constructor({
    levels = ["debug", "info", "warn", "error"],
    sendLevel = "info",
    // ...loggerOptions
  } = {}) {
    // const logger = new WebLogger(loggerOptions: );
    const cutoff = levels.indexOf(sendLevel);
    for (const [idx, level] of levels.entries()) {
      // this[level] = idx < cutoff ? () => {} : logger.log.bind(logger, level);
    }
  }
}
