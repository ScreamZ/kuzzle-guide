## Creating plugins

### > Listener plugins

`listener` plugins simply listen to events, and are supplied with these events data. These plugins cannot change the provided data, and Kuzzle does not wait for them to process the data either.

To configure a plugin as a `listener` on some events, simply expose a `hooks` variable in the plugin context, listing events and the names of plugin functions to execute.

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
    console.log(`Event ${event} triggered`);
    console.log(`Message received: ${message}`);
  }
}
```

### > Worker plugins

<aside class="notice">
The <a href="#the-plugin-context">plugin context</a> provided to worker plugins do not contain <code>accessors</code>
</aside>

A `worker` plugin is simply a `listener` plugin running in separate threads. This is especially useful when you have to perform cost-heavy operations without impeding Kuzzle performances.

To convert a `listener` plugin to a `worker` one, just add the following attribute to the plugin configuration: `threads: <number of threads>`

If this number of threads is greater than 0, Kuzzle will launch the plugin on a single separate thread.  
If the number of configured thread is greater than 1, Kuzzle will dispatch events between these threads using round-robin.

Plugin configuration example:

```json
{
    "path": "/var/kuzzle-plugin-very-useful",
    "defaultConfig": {
      "threads": 2
    },
    "activated": true
  }
```


### > Pipe plugins

`pipe` plugins, like `listener` plugins, are attached to Kuzzle events, and they are supplied with these events data.  

But unlike `listener` plugins, `pipe` plugins can modify the provided data, and Kuzzle wait for these plugin to process it. `pipe` plugins can even invalidate data, resulting to an error returned to the original client.

For this reason, Kuzzle enforces a timeout on data processing, rejecting the data altogether if a `pipe` plugin fails to respond in a timely fashion, and forwarding an error to the original client.

`pipe` plugins functions must take a callback as their last parameter, and this callback must be called at the end of the processing with the following arguments: `callback(error, object)`

* `error`: if there is an error during the function, this parameter must be set with one of the available Error object provided by the plugin context. Otherwise, set it to `null`
* `object`: the resulting data, given back to Kuzzle for processing

<aside class="warning">The resulting data <b>MUST BE</b> of the same type than the provided one. For instance, a "before..." event provides a pipe plugin with a "RequestObject" object, and the plugin <b>MUST</b> return a "RequestObject"</aside>

`pipe` plugins are called in chain. When the `callback()` function is called, the next `pipe` plugin function attached on the event is triggered.   
The order of plugin execution is not guaranteed.

The following plugin example adds a `createdAt` attribute to all new documents:

```javascript
// Plugin pipes configuration
module.exports = {
  'data:beforeCreate': 'addCreatedAt'
}
```

```javascript
// In the main plugin index file
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

### > Controllers

`controller` plugins extend Kuzzle API by adding a new controller and its associated actions (see [API reference](http://kuzzle.io/api-reference/#common-attributes)).


#### How is the API extended

- REST protocol is extended using HTTP routes configured by the plugin (see below). These routes are automatically prefixed with "\_plugin/" + the plugin name.

Examples:

GET action:

```
GET http://kuzzle:7511/api/1.0/_plugin/myplugin/myAction/John%20Doe
```

POST action:

```
POST http://kuzzle:7511/api/1.0/_plugin/myplugin/myAction
{"name": "John Doe"}
```

- For any other protocol, the _controller name_ attribute is prefixed with the plugin name.

Example:

```javascript
{
  controller: 'pluginName/mycontroller',
  action: 'myAction',
  index: 'foo',
  collection: 'bar',
  body: {
    name: "John Doe"
  }
}
```


#### How to implement a `controller` plugin


A controller plugin must expose the following objects:

- A `controllers` object listing one or more controllers

```javascript
// Plugin controller configuration
// In this example, we assume that this code is stored in a "controllers.js" file
module.exports = {
  'mycontroller': 'MyController'
};
```

- A `routes` object listing the corresponding HTTP routes for the REST API

```javascript
// Plugin REST routes configuration.
// In this example, we assume that this code is stored in a "routes.js" file
module.exports = [
  {verb: 'get', url: '/foo/:name', controller: 'mycontroller', action: 'myAction'},
  {verb: 'post', url: '/foo', controller: 'mycontroller', action: 'myAction'},
];
```

_NB: for each action, you can declare either a GET action, a POST action, or both of them._

- The controller code, implementing your actions

<aside class="note">Action methods must return a Promise</aside>

```javascript
// Controller implementation
// In this example, we assume that this code is stored in a "mycontroller.js" file
module.exports = function MyController (pluginContext) {
  this.pluginContext = pluginContext;

  this.myAction = function (requestObject, context)
    var
      responseBody = {},
      response;

    // implement here the result of this controller action

    // Sample response object creation with the context variable:
    response = new this.pluginContext.constructors.ResponseObject(requestObject, responseBody);

    // the function must return a Promise:
    return Promise.resolve(response);
  };
};
```

- Main plugin file example

```javascript
// Main plugin file
var Controller = require('./myController');

module.exports = function () {
  this.controllers = require('./controllers');
  this.routes = require('./routes');
  this.pluginContext = null;

  this.init = function (config, pluginContext, isDummy) {
    this.pluginContext = pluginContext;
    // do something
  };

  this.MyController = function () {
    return new Controller(this.pluginContext);
  };
};
```


### > Protocol plugins

Kuzzle core only supports REST communications. All other supported protocols are implemented as `protocol` plugins.  
By default, the Kuzzle official docker image is shipped with the following protocol plugins:

* [Socket.io](https://www.npmjs.com/package/kuzzle-plugin-socketio)
* [WebSocket](https://www.npmjs.com/package/kuzzle-plugin-websocket)

#### How it works

`protocol` plugins allow Kuzzle to support any existing protocol. These plugins ensure a two-way communication between clients and Kuzzle.  

Requests sent by clients to Kuzzle can be forwarded by protocol plugins using methods exposed in the plugin context.  
To access these methods, simply call ``context.accessors.router.<router method>``:

| Router method | Arguments    | Returns | Description              |
|-----------------|--------------|---------|--------------------------|
| ``newConnection`` | ``protocol name`` (string) <br/>``connection ID`` (string) | A promise resolving to a ``connection context`` object | Declares a new connection to Kuzzle. |
| ``execute`` | ``RequestObject`` (object)<br/>``connection context`` (obtained with ``newConnection``)<br/>A node callback resolved with the request response |  | Executes a client request. |
| ``removeConnection`` | ``connection context`` (obtained with ``newConnection``) | | Asks Kuzzle to remove the corresponding connection and all its subscriptions |


Kuzzle expects `protocol` plugins to expose the following methods:

| Method | Arguments | Description                 |
|------|----------------|-----------------------------|
| ``init`` | `pluginConfiguration, context, isDummy` | [Plugin initialization function](http://kuzzle.io/guide/#gt-plugin-init-function) |
| ``joinChannel`` | `{channel, id}`| Tells protocol plugins that the connection `id` subscribed to the channel `channel` |
| ``leaveChannel`` | `{channel, id}` | Tells protocol plugins that the connection `id` left the channel `channel` |
| ``notify`` | `{channels, id, payload}` | Asks protocol plugins to emit a data `payload` (JSON Object) to the connection `id` (string), on the channels  `channels` (array of strings)|
| ``broadcast`` | `{channels, payload}` | Asks protocol plugins to emit a data `payload` (JSON Object) to clients connected to the channels list `channels` (array of strings) |

The `connection ID` Kuzzle send to plugins is the one declared by `protocol` plugins using `context.accessors.router.newConnection`.

*For more information about channels, see our [API Documentation](http://kuzzle.io/api-reference/#on)*


#### `protocol` plugin implementation example

```javascript
// Protocol plugin implementation
module.exports = function () {
  // for instance, maintain client contexts in a global object
  this.contexts = {};

  this.init = function (config, context, isDummy) {
    // Protocol initialization. Usually opens a network port to listen to
    // incoming messages

    // whenever a client is connected
    context.accessors.router.newConnection("this protocol name", "connection unique ID")
      .then(context => {
        this.contexts["connection unique ID"] = context;
      });

    // whenever a client sends a request
    context.accessors.router.execute(requestObject, this.contexts["id"], (error, response) => {
      if (error) {
        // errors are encapsulated in a ResponseObject. You may simply
        // forward it to the client too
      } else {
        // forward the response to the client
      }
    });

    // whenever a client is disconnected
    context.accessors.router.removeConnection(this.contexts["id"]);
  };

  this.broadcast = function (data) {
    /*
     Invoked by Kuzzle when a "data.payload" payload needs to be
     broadcasted to the "data.channels" channels

     The payload is a ResponseObject
    */
    data.channels.forEach(channel => {
      // ...
    });
  };

  this.notify = function (data) {
    /*
     Invoked by Kuzzle when a "data.payload" payload needs to be
     notified to the connection "data.id", on the "data.channels" channels

     The payload is a ResponseObject
    */

  };

  this.joinChannel = function (data) {
    /*
      Invoked by Kuzzle when the connection "data.id" joins the
      channel "data.channel"
     */
     data.channels.forEach(channel => {
       // ...
     });
  };

  this.leaveChannel = function (data) {
    /*
      Invoked by Kuzzle when the connection "data.id" leaves the
      channel "data.channel"
     */
  };
};
```


### > Authentication plugin

Kuzzle allows users to log in, and the supported authentication strategies can be extended using `authentication` plugins.

Any strategy supported by [Passport](http://passportjs.org/) can be used to extend Kuzzle supported strategies, like we did with our official [OAUTH2 Authentication plugin](https://github.com/kuzzleio/kuzzle-plugin-auth-passport-oauth).

Implementing an `authentication` plugin is a 3-parts process:

#### Choose or implement a Passport strategy

[Passport](http://passportjs.org) supports a wide range of authentication strategies. If that is not enough, you can also implement your own strategy for your authentication plugin.

In any case, the chosen strategy must be available in the plugin local directory when Kuzzle installs it, either by adding the strategy in the plugin's NPM dependencies, or by including the strategy code directly in the plugin repository.

#### Create a verification function

Since Kuzzle uses [Passport](http://passportjs.org) directly, using a strategy with Kuzzle is identical than using one with Passport.

First, you have to implement a [`verify` function](http://passportjs.org/docs/configure), which will be provided to a Passport strategy constructor. This function is then used by the Passport strategy to authorize or to deny access to a user.

The number of arguments taken by this `verify` function depends on the authentication strategy. For instance, a `local password` strategy needs the `verify` callback to be provided with an `user` name and his `password`.

All strategies require this `verify` callback to take a `done` callback as its last argument, supplying Passport with the authenticated user's information.

#### Register the strategy to Kuzzle

Once you chose a strategy and implemented its corresponding `verify` callback function, all you have to do is to register it to Kuzzle, using the `passport` accessor available in the plugin context:

```js
pluginContext.accessors.passport.use(strategy);
```

#### (optional) Scope of access

Some authentication procedures, like OAUTH 2.0, need a [scope of access](http://passportjs.org/docs/oauth) to be configured.

Kuzzle authentication plugins support scope of access. To add one in your plugin, simply expose a `scope` attribute, with the following format:

```js
module.exports = function MyAuthenticationPlugin () {
  // ... plugin implementation
  this.scope = {
    strategyName: ['check', 'the', 'provider', 'supported', 'fields']
  }
};
```

#### Authentication plugin example, using the LocalStrategy strategy

<aside class="notice">Passport strategy constructors take a "verify" callback. As the following example demonstrates, if the provided callback uses "this.[attribute]" attributes, then it's necessary to bind the provided callback to the plugin's context</aside>

```javascript
var
  LocalStrategy = require('passport-local').Strategy;

module.exports = function MyAuthenticationPlugin () {
  this.context = null;

  this.init = function (pluginConfiguration, pluginContext) {
    this.context = pluginContext;

    this.context.accessors.passport.use(new LocalStrategy(this.verify.bind(this)));
  }

  this.verify = function (username, password, done) {
    // Code performing the necessary verifications
    if (success) {
      done(null, {some: "user information"});
    }
    else {
      done(new this.context.errors.ForbiddenError('Login failed'));
    }
  };
};
```
