# weblogger

Splunk logging for the web.

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

## Doesn't [splunk-library-javalogging](https://github.com/splunk/splunk-library-javalogging) already do this?

Yes however there a few issues with this package.
* No offical Splunk support.
* Not actively maintained.
* Dependances have been marked as deprecated.
* Most importantly, it will *not work in browsers*.

## Core Features

* Utilize `sendBeacon` API for asynchronous event transmision.
* Support ECMAScript Modules.
* Works in latest version of all browsers.
* Small, lightweight on reources, and free of external dependences.
* Use `SharedWorker` where available to limit open connections to splunk.
* Support [RFCrfc5424](https://tools.ietf.org/html/rfc5424) logging levels.
