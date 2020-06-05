# weblogger

Splunk logging for the web.

## Core Features
* Sends events directly to Splunk from within the browser.
* Utilize sendBeacon API for asynchronous event transmission.
* Support ECMAScript Modules.
* Works in latest version of all browsers.
* Small file size, lightweight on resources, and free of external dependences.
* Use SharedWorker where available to limit open connections to Splunk.
* Support for all [RFC5424](https://tools.ietf.org/html/rfc5424) logging levels.

## Usage

```js
import WebLogger from '@splunk/weblogger'
const webLogger({
  url: MY_SPLUNK_URL,
  token: MY_TOKEN,
  sendDebug: true,
})
webLogger.error(Error('help!'))
webLogger.warn({ issue: 'jankDetected', item: '#my-button' })
webLogger.info({ action: 'user_logged_in', username: 'steve' })
webLogger.debug({ firstPaintDuration: 100 })
```

## Doesn't [splunk-javascript-logging](https://github.com/splunk/splunk-javascript-logging) already do this?
Yes however there a few issues with this package.
* No official Splunk support.
* Not actively maintained.
* Dependancies have been marked as deprecated.
* Most importantly, it **will not work in browsers**.
