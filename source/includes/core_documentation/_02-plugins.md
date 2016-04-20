## Plugins

Plugins are external components allowing to execute functions on specific event triggering.  
There are several types of plugins:

* **Hook events**: just listen to events and perform other actions (ie: a log plugin). They do not respond to anything directly, they just listen.
* **Pipe events**: perform an action and return something. Kuzzle is waiting that all pipe events are performed before continuing.
* **Controllers**: add a specific controller to Kuzzle.

### Plugins Configuration

Some plugins can be configured. To customize these plugins, all you have to do is to create a file `config/customPlugins.json`, and to put it in the `config/` Kuzzle directory.  

If your Kuzzle is running inside a docker image, you'll have to inject this file in the image.  
In `docker-compose.yml` file, you can have something like:

```yaml
kuzzle:
  image: kuzzleio/kuzzle
  volumes:
    - "host/path/to/customPlugins.json:/var/app/config/customPlugins.json"
  ports:
    - "7511:7511"
    - "7512:7512"
  links:
    - elasticsearch
    - redis
```

Plugins configuration have the following default attributes:

* `path`: The local path where the plugin is hosted on the server.
* `url`: a git URL where the plugin can be found and cloned.
* `version`: the NPM package version to download
* `customConfig`: config for the plugin. Each plugin has a different configuration (required or optional), check the corresponding plugin documentation for more information.
* `defaultConfig`: Don't edit this attribute. The defaultConfig is provided by the plugin itself. If you need to change the configuration, edit the `customConfig` attribute

**Note:**
* A `path`, a `url`, or a `version` parameter is required. Priority is `path`, `url`, `version`; if more than one paramater is set, highest priority parameter is used and others will be ignored.

### Default plugins

#### Logger

By default, the logger plugin is enabled and configured to use the service `winston` (refer to [kuzzle-plugin-logger documentation](https://github.com/kuzzleio/kuzzle-plugin-logger) for more information).  

#### "Passport Local" Authentication

By default, the a standard "passport-local" plugin is enabled to authenticate users with their username/password (refer to [kuzzle-plugin-auth-passport-local documentation](https://github.com/kuzzleio/kuzzle-plugin-auth-passport-local) for more information).

See also the [global authentication mechanism documentation](security/authentication.md).

#### Socket.io communication support

By default, the protocol plugin [socket.io](https://github.com/kuzzleio/kuzzle-plugin-socketio) is installed, allowing to access Kuzzle using Socket.io clients.

The default plugin configuration opens the port `7512`. This can be changed by injecting a custom plugin configuration file.

### How to create a plugin

A plugin is a Javascript module that can be installed with NPM or via a public GIT repository.

#### Configuration

The module must have a `package.json` file with a `pluginInfo` entry. The optional `defaultConfig` will be copied in files `config/defaultPlugins.json` and `config/customPlugins.json` in Kuzzle.

```json
"pluginInfo": {
    "loadedBy": "all",
    "defaultConfig": {
      "service": "winston",
      "level": "info",
      "addDate": true
    }
  }
```

The `loadedBy` option tells Kuzzle to install and load the plugin only by corresponding instance types.  
The accepted values are: `all`, `server` and `worker`. Default value: `all`.

#### The plugin context

Plugins don't have access to the Kuzzle instance. Instead, Kuzzle provides a plugin ``context`` to the ``plugin.init()`` function.

Here is the list of shared objects contained in the provided ``context``:

| Object | Purpose                      |
|--------|------------------------------|
| ``RequestObject`` | Constructor for standardized requests sent to Kuzzle |
| ``ResponseObject`` | Constructor for the standardized Kuzzle non-realtime response objects |
| ``RealTimeResponseObject`` | Constructor for the standardized Kuzzle realtime response objects |
| Errors... | Kuzzle error constructors. The complete list can be found in the ``lib/api/core/errors`` directory |
| ``repositories()`` | Getter function to the security roles, profiles and users repositories |
| ``getRouter()`` | Getter function to the Kuzzle protocol communication system |

#### Architecture

Your main javascript file in your plugin must have a function `init` and expose a `hooks` and/or a `pipes` and/or a `controllers` object. All functions defined in these files must be exposed as main object.


#### The plugin init function

All plugins must expose a ``init`` function. Its purpose is to initialize the plugins according to its configuration.

Kuzzle calls these ``init`` function at startup, during initialization.

Expected arguments:
``function (config, context, isDummy)``

Where:
* ``config``: JSON object containing the plugin configuration (the content of the ``defaultConfig`` or the ``customConfig`` configuration)
* ``context``: the plugin context (see above)
* ``isDummy``: boolean. True: asks the plugin to not really start itself, but instead mock its functionalities (useful when testing plugins, kuzzle, or both)

### > Listener plugins

Hook events are triggered and are non-blocking functions. Listener plugins are configured to be called on these hooks.

```javascript
// Somewhere in Kuzzle
kuzzle.pluginsManager.trigger('event:hookEvent', message);
```

```javascript
/*
  Plugin hooks configuration.
  Let's assume that we store this configuration in a "hooks.js" file
 */
module.exports = {
  'event:hookEvent': 'myFunction'
}
```

```javascript
// Plugin implementation
module.exports = function () {
  this.hooks = require('./config/hooks.js');
  this.init = function (config, context, isDummy) {
    // do something
  }

  this.myFunction = function (message, event) {
    console.log('Event', event, 'is triggered');
    console.log('Here is the message', message);
  }
}
```

### > Pipe plugins

When a pipe event is triggered, we are waiting for all plugins attached on this event. A plugin attached on a pipe event has access to the data and can even change them.
A pipe plugin constructor must take in its last parameter a callback. This callback must be called at the end of the function with `callback(error, object)`:

* error: if there is an error during the function, this parameter must be set. If everything is ok, you can call the function with null
* object: the object to pass to the next function

Plugins are called in chain. When the `callback()` function is called, the next function attached on the event is triggered.  
If the plugin fails to call the callback before timeout, Kuzzle will raise an error and forward it to the requesting clients.

Pipe plugins are useful when you want to modify or validate an object.

```javascript
// Somewhere in Kuzzle
kuzzle.pluginsManager.trigger('event:pipeEvent', requestObject)
  .then(function (modifiedRequestObject) {
    // do something
  });
```

```javascript
// Plugin pipes configuration
module.exports = {
  'event:pipeEvent': 'addCreatedAt'
}
```

```javascript
// In main plugin index file
module.exports = function () {

  this.pipes = require('./config/pipes.js');
  this.init = function (config, context, isDummy) {
    // do something
  }

  this.addCreatedAt = function (requestObject, callback) {
    requestObject.data.body.createdAt = Date.now();
    callback(null, requestObject);
  }
}
```

In this example, in Kuzzle, the `modifiedRequestObject` has now a `createdAt` attribute.

### > Controllers

A plugin controller is a plugin that adds new controller and actions to Kuzzle.
It must expose to Kuzzle:

__A `controllers` object listing one or more controllers:__

```javascript
// Plugin controller configuration
module.exports = {
  'mycontroller': 'MyController'
};
```

__A `routes` object listing the HTTP routes for the REST API:__

```javascript
// Plugin REST routes configuration
module.exports = [
  {verb: 'get', url: '/foo/:name', controller: 'mycontroller', action: 'myAction'},
  {verb: 'post', url: '/foo', controller: 'mycontroller', action: 'myAction'},
];
```

_NB: you can describe any routes you want, according to the actions you need to implement.<br>
For each action, you can declare either a GET action, or a POST action, or both of them._

__The controller code, implementing your actions:__

```javascript
// Controller implementation
module.exports = function MyController (context) {
  this.myAction = function (requestObject)
    var
      responseBody = {},
      response;

    // implement here the result of this controller action

    // Sample response object creation with the context variable:
    response = new context.ResponseObject(requestObject, responseBody);

    // the function must return a Promise:
    return Promise.resolve(response);
  };
};
```

```javascript
// Main plugin file
module.exports = function () {

  this.controllers = require('./config/controllers.js');
  this.routes = require('./config/routes.js');
  this.context = null;
  this.init = function (config, context, isDummy) {
    this.context = context;
    // do something
  };

  this.MyController = function () {
    MyController = require('./controllers/myController'),
    return new MyController(this.context);
  };
};
```

Notes:
* Action methods must return a promise.
* The controller constructor must use a "_context_" variable, which contains
some Kuzzle prototypes such as ResponseObject or KuzzleError,
which can be used by the controller actions.<br>
(see [List of injected prototypes](../lib/api/core/pluginsContext.js) ).


#### How it works

* With non-REST protocols, the _controller_ attribute is prefixed with the plugin name.

Sample:

```javascript
{
  controller: 'myplugin/mycontroller',
  action: 'myAction',
  body: {
    name: "John Doe"
  }
}
```

* With REST protocol, we use the routes configured in _routes.js_.  
These routes are automatically prefixed with "\_plugin/" + the plugin name.

Samples:

GET action:

```
GET http://kuzzle:7511/api/1.0/_plugin/myplugin/foo/John%20Doe
```

POST action:

```
POST http://kuzzle:7511/api/1.0/_plugin/myplugin/foo
{"name": "John Doe"}
```

### > Protocol plugins

Kuzzle core only supports REST communications. All other supported protocols are implemented as protocol plugins.  
By default, the Kuzzle official docker image is shipped with the [Socket.io](https://github.com/kuzzleio/kuzzle-plugin-socketio) protocol.

#### How it works

Protocol plugins allow Kuzzle to support any existing protocol. These plugins ensure a two-way communication between clients and Kuzzle.  

Messages emanating from Kuzzle are emitted using the following hooks. Protocol plugins are free to ignore some or all of these hooks:

| Hook | Emitted object | Description                 |
|------|----------------|-----------------------------|
| ``protocol:joinChannel`` | `{channel, id}`| Tells protocol plugins that the connection `id` subscribed to the channel `channel` |
| ``protocol:leaveChannel`` | `{channel, id}` | Tells protocol plugins that the connection `id` left the channel `channel` |
| ``protocol:notify`` | `{channel, id, payload}` | Asks protocol plugins to emit a data `payload` to the connection `id`, on the channel `channel` |
| ``protocol:broadcast`` | `{channel, payload}` | Asks protocol plugins to emit a data `payload` to clients connected to the channel `channel` |

*For more information about channels, see our [API Documentation](/api-reference/#on)*



Requests sent by clients to Kuzzle can be forwarded by protocol plugins using methods exposed in the plugin context.  
To access these methods, simply call ``context.getRouter().<router method>``:

| Router method | Arguments    | Returns | Description              |
|-----------------|--------------|---------|--------------------------|
| ``newConnection`` | ``protocol name`` (string) <br/>``connection ID`` (string) | A promise resolving to a ``context`` object | Declare a new connection to Kuzzle. |
| ``execute`` | ``optional JWT Headers`` (string)<br/>``RequestObject`` (object)<br/>``context`` (obtained with ``newConnection``)<br/>A node callback resolved with the request response |  | Execute a client request. |
| ``removeConnection`` | ``context`` (obtained with ``newConnection``) | | Asks Kuzzle to remove the corresponding connection and all its subscriptions |

#### Example

First, link protocol hooks to their corresponding implementation methods:

```javascript
// Content of a hooks.js file:
module.exports = {
  'protocol:broadcast': 'broadcast',
  'protocol:notify': 'notify',
  'protocol:joinChannel': 'join',
  'protocol:leaveChannel': 'leave'
};
```

Then, implement the corresponding methods:

```javascript
// Protocol plugin implementation
module.exports = function () {
  this.hooks = require('./hooks.js');
  // for instance, maintain client contexts in a global object
  this.contexts = {};

  this.init = function (config, context, isDummy) {
    // Protocol initialization. Usually opens a network port to listen to
    // incoming messages

    // whenever a client is connected
    context.getRouter().newConnection("this protocol name", "connection unique ID")
      .then(context => {
        this.contexts["connection unique ID"] = context;
      });

    // whenever a client sends a request
    context.getRouter().execute(null, requestObject, this.contexts["id"], (error, response) => {
      if (error) {
        // errors are encapsulated in a ResponseObject. You may simply
        // forward it to the client too
      } else {
        // forward the response to the client
      }
    });

    // whenever a client is disconnected
    context.getRouter().removeConnection(this.contexts["id"]);
  };

  this.broadcast = function (data) {
    /*
     Linked to the protocol:broadcast hook, emitted
     by Kuzzle when a "data.payload" needs to be broadcasted to the
     "data.channel" channel

     The payload is a ResponseObject
    */
  };
  
  this.notify = function (data) {
    /*
     Linked to the protocol:notify hook, emitted
     by Kuzzle when a "data.payload" needs to be emitted to the
     connection "data.id", on the channel "data.channel"
     
     The payload is a ResponseObject
    */
  };

  this.join = function (data) {
    /*
      Linked to the protocol:joinChannel hook, emitted  
      by Kuzzle when the connection "data.id" joins the
      channel "data.channel"
     */
  };

  this.leave = function (data) {
    /*
      Linked to the protocol:leaveChannel hook, emitted  
      by Kuzzle when the connection "data.id" leaves the
      channel "data.channel"
     */
  };
};
```

#### Examples

* [kuzzle-plugin-logger](https://github.com/kuzzleio/kuzzle-plugin-logger)
* [kuzzle-plugin-helloworld](https://github.com/kuzzleio/kuzzle-plugin-helloworld)
* [kuzzle-plugin-socketio](https://github.com/kuzzleio/kuzzle-plugin-socketio)

### > Authentication plugin

Any strategy supported by passportjs can be implemented for Kuzzle with a dedicated plugin (see [plugins documentation](#plugins)).

Take example in [Passport Local plugin](https://github.com/kuzzleio/kuzzle-plugin-auth-passport-local), an authentication plugin must provide following steps:

#### The strategy module

This module is a wrapper to the needed passportjs strategy:

```javascript
// lib/passport/strategy.js
var
  q = require('q'),
  MyNewStrategy = require('passport-my-new-strategy').Strategy;

module.exports = function(context){
  (...)
};
```

It implements:

- a __load__ method to activate the strategy:

```javascript
    this.load = function(passport) {
      passport.use(new MyNewStrategy(this.verify));
    };
```

- a __verify__ method that implements the strategy's [verify callback](http://passportjs.org/docs#verify-callback).

This method accepts a variable numbers of arguments, depending on the strategy, and a _done_ callback that should be invoked when authentication succeed.

<aside class="notice">
because passportjs uses the Callback pattern while Kuzzle uses Promises, you must <strong>promisify</strong> the <em>done</em> callback:
</aside>

```javascript
    this.verify = function(<params>, done) {
      var deferred = q.defer();

        myCustomVerificationMethod(<params>)
        .then(function (userObject) {
          if (userObject !== null) {
            deferred.resolve(userObject);
          }
          else {
            deferred.reject(new context.ForbiddenError('Bad Credentials'));
          }
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      // here is the promisification of the done callback
      deferred.promise.nodeify(done);
      
      return deferred.promise;
    };
```

#### The hook activation

The authController initialization triggers the `auth:loadStrategies` hook event, that can be used to load plugin's strategy, like that:

- declare the hook mapping:

```javascript
// lib/config/hooks.js
module.exports = {
  'auth:loadStrategies': 'loadStrategy',
};
```

- implement the hook method:

```javascript
// lib/index.js
var
  hooks = require('./config/hooks'),
  Strategy = require('./passport/strategy');

module.exports = function () {

  (...)

  this.hooks = hooks;

  this.loadStrategy = function(passport, event) {
    var strategy = new Strategy(this.context);
    strategy.load(passport);
  };

};
```


### Troubleshooting

#### Proxy

If you are using Docker and your network is behind a proxy, you may need to run this [container](https://hub.docker.com/r/klabs/forgetproxy/). This image lets other docker images accessing to external networks using the server proxy configuration.
