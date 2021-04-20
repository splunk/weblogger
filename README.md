# WebLogger

Splunk logging for the web.

## Core Features

- Sends events directly to Splunk from within the browser.
- Utilizes sendBeacon API for asynchronous event transmission.
- Supports ECMAScript Modules.
- Works with latest version of all major browsers and frameworks.
- Small package size, light on resources, and free of external dependences.

## Basic Usage

```js
import WebLogger from "@splunk/weblogger";

const logger = new WebLogger({
  origin: "https://my.splunk.instance.com:8088",
  token: "11111111-2222-3333-4444-555555555555",
});

logger.debug({ event: "time_to_first_paint", duration: 172 });
logger.info({ action: "user_logged_in", username: "bob" });
logger.warn({ type: "violation", reason: "setTimeout handler took 82ms" });
logger.error({ message: "timeout while waiting for fetch", url: "/api/items" });
```

## Advanced Configuration.

| param       | Type   | Default                              | Required | Description                                                    |
| ----------- | ------ | ------------------------------------ | -------- | -------------------------------------------------------------- |
| origin      | string | `undefined`                          | yes      | The origin of your Splunk instance.                            |
| token       | string | `undefined`                          | yes      | The Splunk access token provided by your HEC endpoint.         |
| index       | string | `undefined`                          | no       | Overrides the default index of the HEC.                        |
| host        | string | `undefined`                          | no       | Overrides the default host of the HEC.                         |
| source      | string | `undefined`                          | no       | Overrides the default source of the HEC.                       |
| sourceType  | string | `undefined`                          | no       | Overrides the default sourcetype of the HEC.                   |
| bufferSize  | number | `1024`                               | no       | The max size of events you want to store before sending.       |
| defaultMeta | object | `{}`                                 | no       | Default meta data you would like to append to each event.      |
| levels      | array  | `['debug', 'info', 'warn', 'error']` | no       | The log levels you want to support ascending by priority.      |
| sendLevel   | string | `'info'`                             | no       | The level at which you want to start sending events to Splunk. |

## Doesn't [splunk-javascript-logging](https://github.com/splunk/splunk-javascript-logging) already do this?

Yes however there a few issues with this package.

- No official Splunk support.
- Not actively maintained.
- Dependancies have been marked as deprecated.
- Most importantly, it **will not work in browsers**.
