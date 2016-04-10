# ~ subscribe controller

## count

<section class="rest"></section>
>Due to the synchronous nature of the HTTP protocol, the real-time messaging is not implemented for the REST protocol.

<section class="amqp"></section>
>**replyTo** header required

<section class="stomp"></section>
>**reply-to** header required

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "count",
  body: {
    roomId: "unique room ID"
  },
  metadata: {
    // query metadata
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "count"
  body: {
    roomId: "unique room ID"
  },
  metadata: {
    // query metadata
  }
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: <Unique session ID>,

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "count",
  body: {
    roomId: "unique room ID"
  },
  metadata: {
    // query metadata
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Response


<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "count",
  state: "done",
  requestId: "<Unique ID>",
  result: {
    roomId: "<unique Kuzzle room ID>",
    count: <number of subscriptions>,
  }
}
```

Returns the number of people/applications who have subscribed to the same documents as you have.

The expected parameter is the roomId returned by Kuzzle during the subbscription.

## join

<section class="rest"></section>
>Due to the synchronous nature of the HTTP protocol, the real-time messaging is not implemented for the REST protocol.


<section class="amqp stomp"></section>
>**replyTo** queue header required.

<section class="websocket amqp mqtt stomp"></section>
>Query:

<section class="websocket amqp stomp"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "join",
  body: {
    roomId: "<the room ID to join>"
    },
    metadata: {
      // query metadata
    },
    scope: "<all|in|out|none>",
    state: "<all|pending|done>",
    users: "<all|in|out|none>"
  }
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. Allow Kuzzle to know which client wants to subscribe.
  clientId: "<your unique client ID>",

  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "join",
  body: {
    roomId: "<the room ID to join>"
    },
    metadata: {
      // query metadata
    },
    scope: "<all|in|out|none>",
    state: "<all|pending|done>",
    users: "<all|in|out|none>"
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>response

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "on",
  state: "done",
  metadata: {},                     // subscription metadata
  requestId: "<Unique ID>",
  result: {
    roomId: "<unique Kuzzle room ID>"
  }
}
```

Joins a previously created subscription.

The `roomId` parameter is returned by Kuzzle when [subscribing](#on) to some documents.

## off

<section class="amqp"></section>
>**replyTo** header optional

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "off",

  body: {
    roomId: "<unique room ID>"
  },
  metadata: {
    // query metadata
  }
}
```

<section class="amqp mqtt stomp"></section>
```litcoffee
{
  // Required. Allow Kuzzle to know which client wants to unsubscribe.
  // Must match the clientId sent during the subscription.
  clientId: "<your unique client ID>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "off",

  body: {
    roomId: "<unique room ID>"
  },
  metadata: {
    // query metadata
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Response

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                        // Assuming everything went well
  error: null,                        // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "off",
  state: "done",
  metadata: {},                       // subscription metadata
  requestId: "<Unique ID>",
  result: {
    roomId: "<unique Kuzzle room ID>"
  }
}
```

This action instucts Kuzzle to detach you from its subscribers for the given room.  
In practice, your subscription won't receive any new message on the room once this action is triggered.

The expected parameter is the `roomId` that Kuzzle returned during the subscription.

<aside class="notice">
    <p>
    </p>
    From the client point of view, we could just stop listening for the subscription and not tell Kuzzle about it.
    <p>
    It is however strongly advised to trigger this action to alert Kuzzle it does not need to filter the incoming messages for you anymore.
    </p>
    <p>
    Each time a document is published, Kuzzle needs to check if it needs to be propagated to its clients.
    Leaving too many unneeded subscriptions open can lead to some performance degradation.
    </p>
</aside>

## on

<section class="rest"></section>
>Due to the synchronous nature of the HTTP protocol, the real-time messaging is not implemented for the REST protocol.

<section class="amqp stomp"></section>
>**replyTo** queue header required.

<section class="websocket amqp mqtt stomp"></section>
>Query:


<section class="websocket"></section>
```javascript
var query = {
  /*
  Required. If your query doesn't include a requestId field, Kuzzle
  will discard your query, because it doesn't have any means to send you
  the resulting room ID.
  */
  requestId: "<room name>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "on",

  body: {
    // subscription filters
  },
  metadata: {
    // query metadata
  },

  /*
  The "scope" argument filters document modifications when a change has been
  detected in the database.
  You may receive notifications only when documents enter your
  scope (scope: 'in'), when documents leave it (scope: 'out'), or
  both (scope: 'all')

  You may also filter out all these notifications (scope = 'none')

  Default: scope: 'all'
  */
  scope: "<all|in|out|none>",

  /*
  The "state" argument filters document notifications depending on their state.
  This does not affect pub/sub messages or user events.

  You may choose to only receive document notifications when a change has
  been detected in the database (state = 'done'), when a document is
  about to be changed (state: 'pending'), or both (state: 'all')

  Default: 'done'
  */
  state: "<all|pending|done>",

  /*
  User events are notification sent when users enter or leave the room you
  subscribed to.

  You may choose to receive notifications when users enter the
  room (users: 'in'), when they leave the room (users: 'out'), or
  both (users: 'all')

  Default: 'none
  */
  users: "<all|in|out|none>"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  // Required. Allow Kuzzle to know which client wants to subscribe.
  clientId: "<your unique client ID>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "on",
  body: {
    // subscription filters
  },
  metadata: {
    // query metadata
  },

  // The "scope" argument filters document modifications when a change has been
  // detected in the database.
  // You may receive notifications only when documents enter your
  // scope (scope: 'in'), when documents leave it (scope: 'out'), or
  // both (scope: 'all')
  //
  // You may also filter out all these notifications (scope = 'none')
  //
  // Default: scope: 'all'
  scope: "<all|in|out|none>",

  // The "state" argument filters document notifications depending on their state.
  // This does not affect pub/sub messages or user events.
  //
  // You may choose to only receive document notifications when a change has
  // been detected in the database (state = 'done'), when a document is
  // about to be changed (state: 'pending'), or both (state: 'all')
  //
  // Default: 'done'
  state: "<all|pending|done>",

  // User events are notification sent when users enter or leave the room you
  // subscribed to.
  //
  // You may choose to receive notifications when users enter the
  // room (users: 'in'), when they leave the room (users: 'out'), or
  // both (users: 'all')
  //
  // Default: 'none
  users: "<all|in|out|none>"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the resulting room ID.
  clientId: "<your unique client ID>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "on",

  body: {
    // subscription filters
  },
  metadata: {
    // query metadata
  },

  // The "scope" argument filters document modifications when a change has been
  // detected in the database.
  // You may receive notifications only when documents enter your
  // scope (scope: 'in'), when documents leave it (scope: 'out'), or
  // both (scope: 'all')
  //
  // You may also filter out all these notifications (scope = 'none')
  //
  // Default: scope: 'all'
  scope: "<all|in|out|none>",

  // The "state" argument filters document notifications depending on their state.
  // This does not affect pub/sub messages or user events.
  //
  // You may choose to only receive document notifications when a change has
  // been detected in the database (state = 'done'), when a document is
  // about to be changed (state: 'pending'), or both (state: 'all')
  //
  // Default: 'done'
  state: "<all|pending|done>",

  // User events are notification sent when users enter or leave the room you
  // subscribed to.
  //
  // You may choose to receive notifications when users enter the
  // room (users: 'in'), when they leave the room (users: 'out'), or
  // both (users: 'all')
  //
  // Default: 'none
  users: "<all|in|out|none>"
}
```

<section class="websocket amqp mqtt stomp"></section>
<aside class="right notice">
    If an empty body is provided, the subscription is performed on the whole collection.
</aside>

<section class="websocket amqp mqtt stomp"></section>
>Reponse:

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "subscribe",
  action: "on",
  state: "done",
  metadata: {},                     // subscription metadata
  requestId: "<Unique ID>",
  result: {
    roomId: "<unique Kuzzle room ID>",
    channel: "<unique channel ID>"
  }
}
```

<section class="websocket"></section>
```html
<script src="https://cdn.socket.io/socket.io-1.3.4.js"></script>
<script>
    var socket = io('http://localhost:7512');

    socket.once('mySubscription', function (response) {
      console.log(response);

      /**
      {
        "error":null,
        "status":200,
        "index":"<data index>",
        "collection":""<data collection>"
        "controller":"subscribe",
        "action":"on",
        "state": "done",
        "metadata":{},
        "result":{
            "roomId":"632682a9eac95cfb95e3a697b29b7739",
            "requestId":"mySubscription",
            "timestamp":1449564937142
        }
      }
      */
    });

    socket.emit('kuzzle', {
      requestId: 'mySubscription',
      index: "index",
      collection: 'collection',
      controller: 'subscribe',
      action: 'on',
      body: {}
    });
</script>
```

Subscription works differently in Kuzzle than with a regular publish/subscribe protocol.  
In Kuzzle, you don't exactly subscribe to a room or to a topic but, instead, you subscribe to documents.

What it means is that, along with your subscription query, you also give to Kuzzle a set of document or message filters.  
Of course, you may also subscribe to a ``data collection`` with no other matching criteria, and you'll effectively listen to a 'topic'.

Once you have subscribed to a room, depending on your filters, you may receive the following notifications:

* whenever a pub/sub message is published matching your criteria (realtime)
* whenever a matching document is about to be created or deleted (realtime)
* whenever a matching stored document is created, updated or deleted (once the change is effective in the database)
* whenever a user enters or leaves the room

Good news is, you may ask Kuzzle to send only the notifications relevant to your application, by configuring your subscription request (see below).  
You can also subscribe multiple times to the same room, with different configurations. Kuzzle will provide you with a channel for each of these subscriptions, allowing different part of your application to concentrate on what it needs to process.

The matching criteria you pass on to Kuzzle are based upon [Kuzzle DSL](./filters.md)

How subscription works:

* => You send a subscription query to Kuzzle
* <= Kuzzle responds to you with a ``roomId`` and a `channel`
* => You listen to the ``channel`` provided in the response
* <= Kuzzle forwards the corresponding [notifications](/#notifications) on that channel
