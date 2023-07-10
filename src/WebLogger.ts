type JsonPrimitive = string | number | boolean | null | undefined;
type JsonArray = JsonAny[];
type JsonAny = JsonPrimitive | JsonArray | JsonObject;

interface JsonObject {
  [key: string]: JsonAny;
}

/** https://docs.splunk.com/Documentation/Splunk/latest/Data/FormateventsforHTTPEventCollector */
interface HecOverrides {
  /** Overrides the default host of the HEC. */
  host?: string;
  /** Overrides the default source of the HEC. */
  source?: string;
  /** Overrides the default sourcetype of the HEC. */
  sourceType?: string;
  /** Overrides the default index of the HEC. */
  index?: string;
}

interface WebLoggerConfig extends HecOverrides {
  /** The origin of your Splunk instance. */
  origin: string;
  /** The Splunk access token provided by your HEC endpoint. */
  token: string;
  /** The max size in bytes of events you want to store before sending. */
  bufferCapacity?: number;
  /** The max time in milliseconds to wait before sending events. 0 denotes no timeout  */
  bufferTimeout?: number;
  /** Middleware functions to run on each event */
  middleware?: middleware[];
}

type middleware = (event: JsonObject) => JsonObject;

export default class WebLogger {
  url: string;
  host?: string;
  source?: string;
  sourceType?: string;
  index?: string;
  buffer: string = "";
  bufferCapacity: number;
  middleware: middleware[];

  constructor({
    origin,
    token,
    index,
    host,
    source,
    sourceType,
    bufferCapacity = 4096,
    middleware = [],
  }: WebLoggerConfig) {
    this.url = `${origin}/services/collector/event?token=${token}`;
    this.host = host;
    this.source = source;
    this.sourceType = sourceType;
    this.index = index;
    this.bufferCapacity = bufferCapacity;
    this.middleware = middleware;

    addEventListener("pagehide", () => {
      this.send();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.send();
      }
    });
  }

  /** Adds an event to the event buffer. */
  log(event: JsonObject): boolean {
    for (const middleware of this.middleware) {
      event = middleware(event);
    }

    const fullEvent = {
      index: this.index,
      host: this.host,
      source: this.source,
      sourcetype: this.sourceType,
      time: Date.now(),
      event,
    };

    this.buffer += JSON.stringify(fullEvent);

    if (this.buffer.length >= this.bufferCapacity) {
      return this.send();
    }

    return false;
  }

  /** */
  send(): boolean {
    if (this.buffer) {
      const success = navigator.sendBeacon(this.url, this.buffer);
      if (success) {
        this.buffer = "";
      }
      return success;
    }
    return false;
  }
}
