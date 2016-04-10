# Query syntax

The query message format is (almost) identical between all the protocols.

The only exceptions are about some specific attributes that may become mandatory to get the response back from Kuzzle.

Please refer to the code samples on the right pane for more detail on the specific implementations.

## Common attributes


<section class="websocket"></section>
>The Websocket layer listens to a specific socket room in order to forward your queries to the right Kuzzle controller.  
>**Room name:** `kuzzle`  
>**Query body syntax (JSON data):**

<section class="amqp"></section>
>The MQ Broker layer listens to a specific topic in order to forward your queries to the right Kuzzle controller.  
>**Exchange name:** `amq.topic`  
>**Topic name:** `kuzzle`  
>**Query body syntax (JSON data)**:  

<section class="mqtt"></section>
>The MQ Broker layer listens to a specific topic in order to forward your queries to the right Kuzzle controller.  
>**Topic name:** `kuzzle`  
>**Query body syntax (JSON data):**


<section class="stomp"></section>
>The MQ Broker layer listens to a specific topic in order to forward your queries to the right Kuzzle controller.  
>**Topic:** `/exchange/amq.topic/kuzzle`  
>**Query body syntax (JSON data):**

<section class="websocket rest"></section>
```litcoffee
{
  // Required for queries that need a feedback (see details below):
  requestId: <Unique ID>,

  // Required: Index, Controller and Action to call:
  controller: '<controller>',
  action: '<action>',

  // Index on which the action is handled (empty for actions that do not manage a unique index)
  index: '<data index>',

  // Collection on which the action is handled (empty for actions that do not manage a unique collection)
  collection: '<data collection>',

  // A set of filters matching documents you want to listen to
  body: {..}
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  // Required for queries that need to identify the issuer.
  clientId: <Unique connection ID>,

  // Optional: Kuzzle will create a unique ID if you don't provide one,
  //   and forward this field in its response, allowing you
  //   to easily identify which query generated the response you got.
  requestId: <Unique ID>,

  // Required: Index, Controller and Action to call:
  controller: '<controller>',
  action: '<action>',

  // Index on which the action is handled (empty for actions that do not manage a unique index)
  index: '<data index>',

  // Collection on which the action is handled (empty for actions that do not manage a unique collection)
  collection: '<data collection>',

  // A set of filters matching documents you want to listen to
  body: {..}
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required for queries that need a feeback.
  clientId: <Unique connection ID>,

  // Optional: Kuzzle will create a unique ID if you don't provide one,
  //   and forward this field in its response, allowing you
  //   to easily identify which query generated the response you got.
  requestId: <Unique ID>,

  // Required: Controller and Action to call:
  controller: '<controller>',
  action: '<action>',

  // Index on which the action is handled (empty for actions that do not manage a unique index)
  index: '<data index>',

  // Collection on which the action is handled (empty for actions that do not manage a unique collection)
  collection: '<data collection>',

  // A set of filters matching documents you want to listen to
  body: {..}
}
```

<section class="amqp"></section>
<aside class="right notice">
    <p>
        In order to get responses from Kuzzle, you have to provide a <code>replyTo</code> queue name in your message headers. If you don't, Kuzzle will have no way to reply to you and may even discard your queries if a response is necessary.
    </p>
    <p>
        To get responses from Kuzzle, simply subscribe to the queue you provided in the <code>replyTo</code> header.
    </p>
    <p>
        Once you subscribed to your response topic, you may want to send multiple queries asynchronously to Kuzzle, and make a distinction between which response refers to which query.<br />
        To do that, simply add a unique <code>requestId</code> field to your queries. Kuzzle will send it back in its response!
    </p>
</aside>

<section class="amqp stomp"></section>
<aside class="right notice">
    <p>
        <strong>Note about the clientId attribute:</strong><br />
        The <code>clientId</code> identifies the client connection. You can think of it as a session cookie for AMQP.<br />
    </p>
    <p>
        This attribute to any arbitrary value but should in most cases be unique for the client connection.<br />
        This value is required for any action where Kuzzle needs to identify the issuer of the data.
    </p>
    <p>
        For instance, if you want to unsubscribe from some documents you previously had subscribed to, both the subscription and the unsubscription requests must include the same <code>clientId</code> value.      
    </p>
</aside>

<section class="mqtt"></section>
<aside class="right warning">
    <p>
        While the MQTT protocol and most clients allow to set a client id, this information is lost during the internal transformation of the message by the <a href="https://www.rabbitmq.com/mqtt.html">RabbitMQ MQTT plugin</a>.
    </p>
    <p>
        For the time being, you will need to explicitly set the clientId inside the request. If a client Id is set as part of the MQTT protocol, it won't be seen by Kuzzle.
    </p>
</aside>

<section class="mqtt"></section>
```shell
node_modules/.bin/mqtt publish -h rabbit -i wontBeSeenByKuzzle -t kuzzle -m '{"clientId": "real", ..}'
# the clientId seen by Kuzzle is "real".
```

### controller

_mandatory_

The controller attribute specifies the type of action to perform. The current implementation of Kuzzle embeds five controllers: `admin`, `bulk`, `subscribe`, `read` and `write`.

### action

_mandatory_

The action attribute indicates to Kuzzle which action to perform for the controller.

For instance, using the `read` controller, we can perform a `get` action or a `search`.

### Index

_required depending on the controller/action_

Kuzzle attaches its collections to a index. Any action impacting a document, a collection or an index itself will need this attribute fed.

### collection

_required depending on the controller/action_

Kuzzle attaches its documents to a collection. Any action impacting a document or a collection itself will need this attribute fed.

### body

_mandatory_

The `body` field contains the parameters of the request sent to Kuzzle.

For instance, the `body` attribute will contain the filters on which to listen to during a real-time subscription or the content of the document to create/publish.

## Authorization header

<section class="rest"></section>
```shell
 $ curl -H "Authorization: Bearer <encrypted_jwt_token>" "http://localhost:7511/api/..."
```

<section class="websocket"></section>
```litcoffee
{
  requestId: <Unique ID>,
  controller: '<controller>',
  action: '<action>',
  collection: '<data collection>',

  // Request headers:
  headers: { authorization: 'Bearer <encrypted_jwt_token>' }

  body: {..}
}
```
<section class="amqp mqtt stomp"></section>
```litcoffee
{
  clientId: <Unique connection ID>,
  requestId: <Unique ID>,
  controller: '<controller>',
  action: '<action>',
  collection: '<data collection>',

  // Request headers:
  headers: { authorization: 'Bearer <encrypted_jwt_token>' }

  body: {..}
}
```


Kuzzle uses [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) send within request headers to authenticate users.
The token himself is generated by the [Auth controller](#auth-controller) login action and must be included with each request.
