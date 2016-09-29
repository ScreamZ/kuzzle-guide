## The plugin context

The plugin context is an object containing a set of constructors, accessors and configurations, allowing plugins to interact with Kuzzle.

A plugin context is provided by Kuzzle to plugins when calling their `init` function.  
Each plugin receives its own plugin context instance.

Here is the list of shared objects contained in the provided ``context``:

| Attribute path | Purpose                      |
|----------------|------------------------------|
| `context.accessors.passport` | Access to Kuzzle [Passport](http://passportjs.org) instance |
| `context.accessors.router` | Access to Kuzzle protocol communication system |
| `context.accessors.users` | Access to users management, especially useful for authentication plugins |
| `context.config` | Contains the entire Kuzzle instance configuration (most of it coming from `.kuzzlerc`) |
| `context.constructors.Dsl` | Constructor allowing plugins to instantiate their own Kuzzle DSL instance |
| `context.constructors.RequestObject` | Constructor for standardized requests sent to Kuzzle |
| `context.constructors.ResponseObject` | Constructor for the standardized Kuzzle response objects |
| `errors.<ErrorConstructor>` |Kuzzle error constructors, built dynamically from available Kuzzle error objects at runtime|

**Note:** `context.accessors` are not available to [worker plugins](#gt-worker-plugins), as they are run in their own process(es), without access to Kuzzle instances.

### > Accessor: `passport`

<aside class="notice">
<a href="#gt-worker-plugins">Worker plugins</a> don't have access to accessors
</aside>

The `passport` accessor allow [authentication plugins](/#gt-authentication-plugin) to register a new login strategy to Kuzzle.

This accessor exposes the following method:

#### **`use(strategy)`**

Implements [Passport `use()` method](http://passportjs.org/docs/configure)

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
| `strategy` | `Strategy object` | A Passport instantiated strategy object |

<aside class="notice">Passport strategy constructors take a "verify" callback. As the following example demonstrates, if the provided callback uses "this.[attribute]" attributes, then it's necessary to bind the provided callback to the plugin's context</aside>

Example:

```js
var LocalStrategy = require('passport-local').Strategy;

function verify (username, password, done) {
  // verification code
  if (userVerified) {
    done(null, userInformation);
  }
  else {
    done(error);
  }
}

pluginContext.accessors.passport.use(new LocalStrategy(verify.bind(this)));
```

### > Accessor: `router`

<aside class="notice">
<a href="#gt-worker-plugins">Worker plugins</a> don't have access to accessors
</aside>

The `router` accessor allows protocol plugins to interface themselves with Kuzzle. This accessor exposes the following methods:

#### `newConnection(protocolName, connectionUniqueId)`

Declares a new connection for a given protocol.  

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`protocolName`|`string`|Protocol name, used for Kuzzle internal statistics |
|`connectionUniqueId`|`string`|Unique ID identifying the user connection|

##### Returns

A `promise` resolving to a `context` object. This object is needed for other router methods.

#### `execute(requestObject, context, callback)`

Forward a request to Kuzzle.

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`requestObject`|`object`| An user request wrapped as a `RequestObject` instance|
|`context`|`object`| Object identifying the connection context. Obtained by calling `newConnection()`|
|`callback`|`function`| Callback called with the request corresponding results |

##### Callback

The callback is invoked once the request has been processed by Kuzzle.  
The provided callback arguments are: `(error, responseObject)`, where `error` is a standard `Error` object and `responseObject` is a standardized Kuzzle response.

#### `removeConnection(context)`

Removes a connection from the connection pool maintained by Kuzzle.  
Not calling this method after a connection is dropped will result in a memory-leak.

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`context`|`object`| Object identifying the connection context. Obtained by calling `newConnection()`|


### > Accessor: `users`

<aside class="notice">
<a href="#gt-worker-plugins">Worker plugins</a> don't have access to accessors
</aside>

The `users` accessor provides methods for handling users. This accessor is mainly used by authentication plugins.

#### `create(loginName, [userProfile], [userInfo])`

Creates a new user in Kuzzle. Will return an error if the user already exists.

##### Arguments

| Name | Type | Default Value | Description                      |
|------|------|---------------|----------------------------------|
|`loginName`|`string`| | Name of the user's login to create |
|`userProfile`|`string`|`default`| [User profile](#permissions) |
|`userInfo`|`object`| `{}` | Misc. information about the user |

##### Returns

A `promise` resolving a `user` object containing the created information.

#### `load(loginName)`

Loads a user from Kuzzle

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`loginName`|`string`| Name of the user's login to load |

##### Returns

A `promise` resolving to a `user` object containing the user information.

### > Constructor: `Dsl`

The DSL constructor provided in the plugin context gives access to [Kuzzle real-time filtering capabilities](#filtering-syntax). It allows managing filters, and testing data to get a list of matching filters.

Each plugin can instantiate its own sandboxed DSL instance:

```js
var dsl = new context.constructors.Dsl();
```

The DSL exposes the following methods:


#### `register(index, collection, filters)`

Registers a filter to the DSL.

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`index`|`string`| Data index name |
|`collection`|`string`| Data collection name |
|`filters`|`object`| Filters in [Kuzzle DSL](#filtering-syntax) format |

##### Returns

A `promise` resolving to an object containing the following attributes:

* `id`: the filter unique identifier
* `diff`: the difference between the added filters and what already existed in memory. Falsey if no difference occured
* `filter`: a normalized version of the provided filters

#### `remove(filterId)`

Removes all references to a given filter from the DSL

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`filterId`|`string`| Filter unique ID. Obtained by using `register`|

##### Returns

A `promise` resolved once the filter has been completely removed from the DSL

#### `test(index, collection, data, [documentId])`

Test data against filters registered in the DSL, returning matching filter IDs, if any.

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`index`|`string`| Data index name |
|`collection`|`string`| Data collection name |
|`data`|`object`| Data to test against filters |
|`documentId`|`string`| If applicable, document unique ID |


##### Returns

A `promise` resolving to an array of `filterId` matching the provided data (and/or documentId, if any)

#### `exists(index, collection)`

Returns a boolean indicating if filters exist for an index-collection pair


##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`index`|`string`| Data index name |
|`collection`|`string`| Data collection name |


##### Returns

Returns `true` if at least one filter exists on the provided index-collection pair, returns `false` otherwise

#### `getFilterIds(index, collection)`

Retrieves filter IDs registered on an index-collection pair


##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`index`|`string`| Data index name |
|`collection`|`string`| Data collection name |

##### Returns

An `array` of `filterId` corresponding to filters registered on an index-collection pair.

### > Constructor: `RequestObject`

This constructor is used to transform an [API request](http://kuzzle.io/api-reference/?websocket#common-attributes) into a standardized Kuzzle request.

#### `RequestObject(data)`

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`data`|`object`| Data containing the necessary attributes to perform an API request |

Where `data` may contain some or all of the following attributes:

| Name | Type | Description                      |
|------|------|----------------------------------|
|`action`|`string`| Kuzzle action to perform |
|`collection` |`string` | Data collection |
|`controller` |`string`| Kuzzle controller handling the action to perform |
|`_id`|`string`| Document unique identifier |
|`body`|`object`| Contains request specific data (document content, search queries, ...) |
|`index` |`string`| Data index |
|`metadata`|`object`| Contains request specific metadata |
|`timestamp`|`integer`| Request timestamp |


Here is an example:

```js
var requestObject = new context.constructors.RequestObject({
  controler: 'write',
  action: 'create',
  index: 'foo',
  collection: 'bar',
  _id: 'some document ID',
  body: {
    document: 'content'
  },
  metadata: {
    some: 'volatile data'
  }
});
```

##### RequestObject attributes

| Name | Type | Description                      |
|------|------|----------------------------------|
|`RequestObject.action`|`string`| Kuzzle action to perform |
|`RequestObject.collection` |`string` | Data collection |
|`RequestObject.controller` |`string`| Kuzzle controller handling the action to perform |
|`RequestObject.data._id`|`string`| Document unique identifier |
|`RequestObject.data.body`|`object`| Contains request specific data (document content, search queries, ...) |
|`RequestObject.index` |`string`| Data index |
|`RequestObject.metadata`|`object`| Contains request specific metadata |
|`RequestObject.timestamp`|`integer`| Request timestamp |


Please refer to our [API Reference](http://kuzzle.io/api-reference/?websocket) for a complete list of controllers-actions and their purposes.

### > Constructor: `ResponseObject`

This constructor creates a standardized Kuzzle Response object from a `RequestObject` and response data.

#### `ResponseObject(requestObject, responseData)`

##### Arguments

| Name | Type | Description                      |
|------|------|----------------------------------|
|`requestObject`|`RequestObject object`| The request object that generated the response data |
|`responseData`|`object`| Plain-old JSON object containing the request's results |

##### ResponseObject attributes

| Name | Type | Description                      |
|------|------|----------------------------------|
|`action`|`string`| Kuzzle action to perform |
|`collection` |`string` | Data collection |
|`controller` |`string`| Kuzzle controller handling the action to perform |
|`data._id`|`string`| Document unique identifier |
|`data.body`|`object`| Contains response data (document content, search results, ...) |
|`error`|`Error object`| In case of error, contains the error object |
|`index` |`string`| Data index |
|`metadata`|`object`| Contains request specific metadata |
|`status`|`integer`| Request status, using [HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|`timestamp`|`integer`| Request timestamp |


#### `toJson()`

Transforms the `ResponseObject` object into a plain-old JSON object following [Kuzzle standard response format](http://kuzzle.io/api-reference/?websocket#kuzzle-response)

### > Error: `BadRequestError`

**Status Code:** `400`

Used to notify about badly formed requests.

```js
var err = new context.errors.BadRequestError('error message');
```

### > Error: `ForbiddenError`

**Status Code:** `403`

Used when a user tries to use resources beyond his access rights.

```js
var err = new context.errors.ForbiddenError('error message');
```

### > Error: `GatewayTimeoutError`

**Status Code:** `504`

Used when a plugin takes too long to perform a task.

```js
var err = new context.errors.GatewayTimeoutError('error message');
```

### > Error: `InternalError`

**Status Code:** `500`

Standard generic error. Used for uncatched exceptions.

```js
var err = new context.errors.InternalError('error message');
```

### > Error: `NotFoundError`

**Status Code:** `404`

Used when asked resources cannot be found.

```js
var err = new context.errors.NotFoundError('error message');
```

### > Error: `ParseError`

**Status Code:** `400`

Used when a provided resource cannot be interpreted.

```js
var err = new context.errors.ParseError('error message');
```

### > Error: `PartialError`

**Status Code:** `206`

Used when a request only partially succeeded.

The constructor takes an additional `array` argument containing a list of failed parts.

```js
var err = new context.errors.PartialError('error message', [{this: 'failed'}, {andThis: 'failed too'}]);
```


### > Error: `PluginImplementationError`

**Status Code:** `500`

Used when a plugin fails.

```js
var err = new context.errors.PluginImplementationError('error message');
```

### > Error: `ServiceUnavailableError`

**Status Code:** `503`

Used when a resource cannot respond because it is temporarily unavailable.

```js
var err = new context.errors.ServiceUnavailableError('error message');
```

### > Error: `UnauthorizedError`

**Status Code:** `401`

Used when a user fails a login attempt.

```js
var err = new context.errors.UnauthorizedError('error message');
```
