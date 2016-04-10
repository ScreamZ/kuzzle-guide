# ~ auth controller

## checkToken

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_checkToken`  
>**Method:** `POST`  
>**Body:**  

<section class="rest"></section>
```litcoffee
{
  body: {
    token: '...'
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "auth",
  action: "checkToken",
  body: {
    token: '...'
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "auth",
  action: "checkToken",
  body: {
    token: '...'
  }
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "auth",
  action:  "checkToken",
  body: {
    token: '...'
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  controller: "auth",
  action: "checkToken",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    valid: <boolean>,

    // if "valid" is false, contains the reason why the provided token is
    // invalid.
    // This field is not present if "valid" is true.
    state: "Error message",

    // if "valid" is true, contains the expiration timestamp.
    // This field is not present if "valid" is false.
    expiresAt: <timestamp>
  }
}
```

Checks a JWT Token validity.  
This API route does not require to be logged in.

## getCurrentUSer

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/auth/_me`  
>**Method:** `GET`  

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "auth",
  action: "getCurrentUser"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "auth",
  action: "getCurrentUser"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "auth",
  action: "getCurrentUser"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "auth",
  action: "getCurrentUser",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id:"<user id>",
    _source: {
      name: {
        first: "Steve",
        last: "Wozniak"
        },
        ...                         // The user object content
        profile: {
          _id:"<profile id>",
          roles: [
            ...                     // Users roles definitions
          ]
        }
    }
  }
}
```

Gets the user object identified by the `JSON Web Token` sent in the `Authorization` header.

## login

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_login` <br />
>**Method:** `POST` <br />
>**Body:**

<section class="rest"></section>
```litcoffee
{
  body: {
    // authentication strategy identifier (optionnal : kuzzle will use 'local' strategy if not set)
    strategy: '<passportjs_strategy>',

    // jwt token expiration time (optional - kuzzle will use server default value if not set)
    // expressed in seconds or a string describing a time span. Eg: 60, "2 days", "10h", "7d", "1y"
    expiresIn: '<expiresIn>',

    // set of parameters depending of the chosen strategy. Example for 'local' strategy:
    username: '<username>',
    password: '<password>'
  }
}
```

<section class="amqp stomp"></section>
>**replyTo** header is **required**.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "auth",
  action: "login",

  body: {
    // authentication strategy identifier (optional - kuzzle will use 'local' strategy if not set)
    strategy: '<passportjs_strategy>',

    // jwt token expiration time (optional - kuzzle will use server default value if not set)
    // expressed in seconds or a string describing a time span. Eg: 60, "2 days", "10h", "7d", "1y"
    expiresIn: '<expiresIn>',

    // set of parameters depending of the chosen strategy. Example for 'local' strategy:
    username: '<username>',
    password: '<password>'
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  controller: "auth",
  action: "login",
  state: "done",
  requestId: "<unique request identifier>",
  metadata: {},
  result: {
    _id: "<user ID>",
    jwt: "<JWT encrypted token>"
  }
}
```

Authenticate a user with a defined **passportjs** authentication strategy.
See [passportjs.org](http://www.passportjs.org/) for more details about authentication strategies.

Strategies are implemented as [plugins](https://github.com/kuzzleio/kuzzle/blob/master/docs/plugins.md).
The default 'local' strategy is enabled by default (see [kuzzle-plugin-auth-passport-local](https://github.com/kuzzleio/kuzzle-plugin-auth-passport-local)), and let you authenticate with a login and password.

The **_login** action returns an encrypted JWT token, that must then be sent within the [requests headers](#authorization-header).



## logout

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_logout` <br />
>**Method:** `GET` <br />
>**Headers:** `Authorization: 'Bearer <encrypted_jwt_token>'` <br />

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "auth",
  action: "logout",

  headers: {
    authorization: '<encrypted_jwt_token>'
  }
}
```

Revoke token validity & unsubscribe from registered rooms

The **_logout** action doesn't take strategy.

<aside class="warning">
    <strong>The auth/logout action will be removed on the next RC1 release of Kuzzle.</strong>
    <br>
    <br>
    Kuzzle will implement two authentication modes soon:
  <ol>
    <li>
      A default stateless mode, in which the expiration will solely rely on the JWT ttl. The logout action won't be available in this mode.
    </li>
    <li>
      A full Session mode, handled by a plugin, in which the logout route will be updated (@tbd).
    </li>
  </ol>
</aside>
