# Notifications

<section class="websocket"></section>
```html
<script src="https://cdn.socket.io/socket.io-1.3.4.js"></script>
<script>
  var socket = io('http://localhost:7512');

  // step 1 - we prepare ourself to receive Kuzzle's subscription response and then listen to the created channel.
  socket.once('mySubscription', function (response) {
    // we now have a channel to listen to
    socket.on(response.result.channel, function (notification) {
      console.log(notification);

      /*
      {
        status: 200,
        error: null,
        index: "index",
        collection:"collection",
        controller: "write",
        action: "publish",
        state: "done",
        scope: "in",
        requestId: "3d4e7dd1-fcc1-4b50-be7c-7c701b5d6c53",
        result: {
          ..                      // the published document
        }
      }
      */
    });
  });

  // step 2 - we subscribe to our documents
  socket.emit('kuzzle', {
    requestId: 'mySubscription',
    index: 'index',
    collection: 'collection',
    controller: 'subscribe',
    action: 'on',
    body: {}
  });

  // step 3 - when publishing a message, we get some notifications back
  socket.emit('kuzzle', {
    index: 'index',
    collection: 'collection',
    controller: 'write',
    action: 'publish',
    body: {
      foo: 'bar'
    }
  });
</script>
```

<section class="amqp"></section>
```shell
# shell 1 - We subscribe to our room
amqp-declare-queue -u amqp://rabbit:5672 -q response
response
amqp-publish -u amqp://rabbit:5672 -t response -e amq.topic -r kuzzle -b '{}'
amqp-get -u amqp://rabbit:5672 -q response
{"status":200,"error":null,"index":"index","collection":"collection","controller":"controller","action":"action","metadata":{},"requestId":"60621753-2da2-441a-b30b-546127f26cd1","result":{"roomId":"632682a9eac95cfb95e3a697b29b7739","channel":"632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e","timestamp":1450267140597}}

# shell 2 - We listen to the subcribtion
amqp-consume -u amqp://rabbit:5672 -e amq.topic -r 632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e cat

# shell 1 - We can publish a message
amqp-publish -u amqp://rabbit:5672 -t response -e amq.topic -r kuzzle -b '{"clientId": "bev", "controller": "write", "action":"publish", "index": "index", "collection": "collection", "body": { "foo":"bar"}}'

# shell 2 - We receive the notifications
{"status":200,"error":null,"index":"index","collection":"collection","controller":"controller","action":"action","state":"done","scope":"in","metadata":{},"requestId":"10bca195-f375-4b72-817a-04fcb22b3681","result":{"_source":{"foo":"bar"}}}
```

<section class="mqtt"></section>
```shell
# shell 1 - getting direct responses from kuzzle
node_modules/.bin/mqtt subscribe -v -h rabbit -t mqtt.myId

# shell 2 - we subscribe to our documents
node_modules/.bin/mqtt publish -h rabbit -t kuzzle -m '{"clientId": "myId", "controller": "subscribe", "action":"on", "index": "index", "collection": "collection", "body": {}}'

# shell 1
mqtt/myId {"status":200,"error":null,"index":"index","collection":"collection","controller":"controller","action":"action","metadata":{},"requestId":"60621753-2da2-441a-b30b-546127f26cd1","result":{"roomId":"632682a9eac95cfb95e3a697b29b7739","channel":"632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e","timestamp":1450267140597}}

# shell 3 - we subscribe to the nofitications
node_modules/.bin/mqtt subscribe -h rabbit -t 632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e

# shell 2 - we publish a message
node_modules/.bin/mqtt publish -h rabbit -t kuzzle -m '{"controller": "write", "action": "publish", "index": "index", "collection": "collection", "body": {"foo": "bar"}}'

# shell 3
{"status":200,"error":null,"index":"index","collection":"collection","controller":"controller","action":"action","state":"done","scope":"in","metadata":{},"requestId":"10bca195-f375-4b72-817a-04fcb22b3681","result":{"_source":{"foo":"bar"}}}
```

<section class="stomp"></section>
```shell
nc rabbit 61613

CONNECT

^@
CONNECTED
session:session-4DixRlYTG4HjSQqcKpTygw
heart-beat:0,0
server:RabbitMQ/3.5.6
version:1.0

SUBSCRIBE
destination: /queue/myResponse

^@
SEND
destination: /exchange/amq.topic/kuzzle
content-type: application/json
reply-to: myResponse

{"controller":"subscribe", "action": "on", "index": "index", "collection": "collection", "body": {}}

^@
MESSAGE
destination:/queue/myResponse
message-id:Q_/queue/myResponse@@session-4DixRlYTG4HjSQqcKpTygw@@1
redelivered:false
persistent:true
content-length:306

{"status":200,"error":null,"index":"index","collection":"collection","controller":"controller","action":"action","metadata":{},"requestId":"60621753-2da2-441a-b30b-546127f26cd1","result":{"roomId":"632682a9eac95cfb95e3a697b29b7739","channel":"632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e","timestamp":1450267140597}}

SUBSCRIBE
destination: /topic/632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e

^@
SEND
destination: /exchange/amq.topic/kuzzle
content-type: application/json
reply-to: myResponse

{"controller":"write", "action": "publish", "index": "index", "collection": "collection", "body": {"foo":"bar"}}

^@
MESSAGE
destination:/queue/myResponse
message-id:Q_/queue/myResponse@@session-4DixRlYTG4HjSQqcKpTygw@@2
redelivered:false
persistent:true
content-length:210

{"status":200,"error":null,"index":"index","collection":"collection","controller":"controller","action":"action","state":"done","scope":"in","metadata":{},"requestId":"10bca195-f375-4b72-817a-04fcb22b3681","result":{"_source":{"foo":"bar"}}}
MESSAGE
destination:/topic/632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e
message-id:Q_/topic/632682a9eac95cfb95e3a697b29b7739-1c7beed7521fd0b0a8177f219b786d2e@@session-4DixRlYTG4HjSQqcKpTygw@@3
redelivered:false
persistent:true
content-length:210

{"status":200,"error":null,"index":"index","collection":"collection","controller":"controller","action":"action","state":"done","scope":"in","metadata":{},"requestId":"10bca195-f375-4b72-817a-04fcb22b3681","result":{"_source":{"foo":"bar"}}}
```

<section class="stomp"></section>
>The Ctrl-@ (^@) keyboard sequence inserts a zero byte into the stream. If you want to play the given samples, you need to send Ctrl-@ each time the ^@ is displayed.


[Subscribing to some documents in Kuzzle](#on) allows to be notified back each time a document matches your criteria.  
The subscription action (subscribe/on) returns a channel identifier which you can then listen to receive the
notifications.

You can receive the following types of notifications:

**Document Notifications:**

* A document has been created
* A document has been updated and entered your subscription scope
* A document has been updated and left your subscription scope
* A document has been deleted
* A document is about to be created (realtime)
* A document is about to be deleted (realtime)

**Subscription Notifications:**

* A user subscribed to this room
* A user left this room

**Server Notifications:**

* Your JWT Token has expired

## A document has been created

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "create",
  state: "done",                      // The document has been fully created
  scope: "in",                        // The document entered your room scope
  metadata: {
    // metadata embedded in the request
  },
  requestId: "<unique request ID>",   // The query updating the document
  result: {
    _id: "unique document ID",
    _source: {...}                    // The created document
  }
}
```

## An updated document entered your listening scope

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "update",
  state: "done",                      // The document has been fully updated
  scope: "in",                        // The document entered your room scope
  metadata: {
    // metadata embedded in the request
  },
  requestId: "<unique request ID>",   // The query updating the document
  result: {                           // The updated document
    _id: "<unique document ID>",
    ...
  }
}
```

## An updated document left your listening scope

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "update",
  state: "done",                     // The document has been fully updated
  scope: "out",                      // The document left your room scope
  metadata: {
    // metadata embedded in the request
  },
  requestId: "<unique request ID>",  // The query updating the document
  result: {                          // The updated document
    _id: "<unique document ID>",
    ...
  }
}
```

## A document has been deleted

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "delete",
  state: "done",                     // The document has been fully deleted
  scope: "out",                      // The document left your room scope
  metadata: {
    // metadata embedded in the request
  },
  requestId: "<unique request ID>",  // The query deleting the document
  result: {                          // The updated document
    _id: "<unique document ID>",
    ...
  }
}
```

## A document is about to be created

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "create",
  state: "pending",                   // Indicates that the document will be created
  metadata: {},
  result: {}
}
```

## A document is about to be deleted

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "delete",
  state: "pending",                   // Indicates that the document will be deleted
  metadata: {},
  result: {}
}
```

## A user subscribed to this room

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "on",
  metadata: {
    // metadata embedded in the request
  },
  requestId: "<unique request ID>",  // The query deleting the document
  result: {
    roomId: "<unique Kuzzle room ID>",
    count: <the new user count on that room>
  }
}
```

## A user left this room

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "off",
  metadata: {
    // metadata embedded in the request
  },
  requestId: "<unique request ID>",  // The query deleting the document
  result: {
    roomId: "<unique Kuzzle room ID>",
    count: <the new user count on that room>
  }
}
```

## Your JWT Token has expired

<aside class="warning">
This notification is sent to all subscriptions when the JWT Token expires, and
it cannot be filtered.
</aside>

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  controller: "auth",
  action: "jwtTokenExpired",
  requestId: "server notification",   
}
```
