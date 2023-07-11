export default class WebLogger {
    url;
    host;
    source;
    sourceType;
    index;
    buffer = "";
    bufferCapacity;
    middleware;
    constructor({ origin, token, index, host, source, sourceType, bufferCapacity = 4096, middleware = [], }) {
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
    log(event) {
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
    send() {
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
