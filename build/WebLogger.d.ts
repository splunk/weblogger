interface JsonValue {
    [key: string]: string | number | boolean | null | JsonValue | JsonValue[];
}
interface WebLoggerConfig {
    origin: string;
    token: string;
    index?: string;
    host?: string;
    source?: string;
    sourceType?: string;
    bufferSize?: number;
    defaultMeta?: JsonValue;
}
export declare class WebLogger {
    url: string;
    index: string;
    host: string;
    source: string;
    sourceType: string;
    buffer: string;
    bufferSize: number;
    defaultMeta: JsonValue;
    constructor({ origin, token, index, host, source, sourceType, bufferSize, defaultMeta, }: WebLoggerConfig);
    /**
     *
     * @param  {level} string
     * @param  {Object} event
     * @returns {boolean}
     */
    log(level: any, event?: {}): boolean;
}
export default class WebLoggerWrapper {
    /**
     * Wraps the WebLogger class with log level methods.
     * @param {Object} options
     * @param {Array} options.levels - The log levels you want to support ascending by priority.
     * @param {string} options.sendLevel - The level at which you want to start sending events to Splunk.
     * @returns {undefined}
     */
    constructor({ levels, sendLevel, }?: {
        levels?: string[];
        sendLevel?: string;
    });
}
export {};
