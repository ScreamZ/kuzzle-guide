---
title: Connecting to Kuzzle
---

# Connecting to Kuzzle

The connection to Kuzzle depends on the protocol to be used.

## HTTP REST

<section class="rest"></section>
```shell
 $ curl "http://localhost:7511/api/1.0"
 {"error":null,"result":"Hello from Kuzzle :)","status":200}
```

By default, Kuzzle exposes itself on the 7511 port. Assuming the Kuzzle server runs locally, it can be reached on http://localhost:7511/api/1.0.
Note that REST is the only protocol shipped in Kuzzle's core.

## Socket.io

Official docker images embed the [Socket.io](https://www.npmjs.com/package/kuzzle-plugin-socketio) protocol plugin.
By default, this plugin listens to the port 7512.

<section class="websocket"></section>
```html
<script src="https://cdn.socket.io/socket.io-1.3.7.js"></script>
<script>
    var socket = io('http://localhost:7512');
</script>
```

## Message Queuing protocols

/!\\ This section is going to change in the near future: message queuing protocols will be ported to protocol plugins.

Kuzzle embeds a MQ Broker servicer layer that supports a variety of MQ protocols. This broker is a 2-way means of communication between your application and Kuzzle, forwarding your queries forth to Kuzzle, and notifications/responses from Kuzzle back to your application.

The current implementation of our MQ Broker service uses [RabbitMQ](https://www.rabbitmq.com).

**Note:** Have a look at [the Kuzzle documentation](https://github.com/kuzzleio/kuzzle/blob/master/docs/MQ-broker.md) for a quick explanation on how to activate this protocol in Kuzzle.

### AMQP

<section class="amqp"></section>
```shell
amqp-declare-queue -u amqp://rabbit:5672 -q response
amqp-publish -u amqp://rabbit:5672 -t response -e amq.topic -r kuzzle -b '{"index": "index", "collection": "collection", "controller": "write", "action": "createOrReplace", "body": {"firstName": "John", "lastName": "Doe"} }'
amqp-get -u amqp://rabbit:5672 -q response

{"error":null,"result":{"_id":"AVFs7mfw5ZVpUuiPrN1H","_index":"index","_source":{"firstName":"John","lastName":"Doe"},"_type":"collection","_version":1,"action":"createOrReplace","collection":"collection","controller":"write","created":true,"metadata":{},"requestId":"1109ec50-9473-4e75-91ac-673debb2b8ac"},"status":200}
```

RabbitMQ implements the [0.9.1 version of the AMQP protocol](https://www.rabbitmq.com/amqp-0-9-1-quickref.html).

By default, the RabbitMQ instance shipped with Kuzzle exposes itself on the 5672 port.  

<aside class="info">
    The examples given in this documentation use the amqp-tools utilities that are shipped within the Kuzzle Docker container.<br />
    You can play them by entering the kuzzle container. Once your docker compse stack is running (<a href="https://github.com/kuzzleio/kuzzle/blob/master/docs/MQ-broker.md">make sure the RabbitMQ service is also included</a>):<br />
    <code>docker exec -ti kuzzle_kuzzle_1 zsh </code>
</aside>

### MQTT

<section class="mqtt"></section>
```shell
# shell 1
node_modules/.bin/mqtt subscribe -v -h rabbit -t mqtt.myId
# shell 2
node_modules/.bin/mqtt publish -h rabbit -t kuzzle -m '{"clientId": "myId", "collection":"index", "collection":"collection", "controller": "write", "action": "createOrReplace", "body": {"firstName": "John", "lastName": "Doe"}}'
# shell 1
mqtt/myId {"error":null,"result":{"_id":"AVF8NG3k5ZVpUuiPrN1K","_index":"index","_source":{"firstName":"John","lastName":"Doe"},"_type":"collection","_version":1,"action":"createOrReplace","collection":"collection","controller":"write","created":true,"metadata":{},"requestId":"5cb4d930-62f4-4393-afc1-9a71e284a214"},"status":200}
```

<section class="mqtt"></section>
<aside class="right warning">
  <p>
  While the MQTT protocol and most clients allow to set a client id, this information is lost during the internal transformation of the message by the RabbitMQ MQTT plugin.
  </p>
  <p>
  For the time being, you will need to explicitly set the clientId inside the request. If a client Id is set as part of the MQTT protocol, it won’t be seen by Kuzzle.
  </p>
</aside>

The [RabbitMQ MQTT plugin](https://www.rabbitmq.com/mqtt.html) implements the 3.1.1 version of the protocol.

By default, the MQTT service shipped with Kuzzle exposes itself on the port 1883.

<aside class="info">
    The examples given in this documentation use the cli client from the mqtt node.js library that is shipped within the Kuzzle Docker container.<br />
    You can play them by entering the kuzzle container. Once your docker compse stack is running (<a href="https://github.com/kuzzleio/kuzzle/blob/master/docs/MQ-broker.md">make sure the RabbitMQ service is also included</a>):<br />
    <code>docker exec -ti kuzzle_kuzzle_1 zsh </code>
</aside>

### STOMP

<section class="stomp"></section>
```shell
$ nc rabbit 61613
CONNECT

^@
CONNECTED
session:session-1S6Z0zqY2hZ1qHCM6oMmZg
heart-beat:0,0
server:RabbitMQ/3.5.6
version:1.0

SUBSCRIBE
destination:/queue/myResponse

^@
SEND
destination: /exchange/amq.topic/kuzzle
content-type: application/json
reply-to: myResponse

{"index":"index", "collection":"collection", "controller": "write", "action": "createOrReplace", "body": {"firstName": "John", "lastName": "Doe"}}
^@
MESSAGE
destination:/queue/myResponse
message-id:Q_/queue/myResponse@@session-IDWQLUSoT5fwtINA3uggBg@@1
redelivered:false
persistent:true
content-length:323

{"error":null,"result":{"_id":"AVF8oHYh5ZVpUuiPrN1O","_source":{"firstName":"John","lastName":"Doe"},"_index":"index","_type":"collection","_version":1,"action":"createOrReplace","collection":"collection","controller":"write","created":true,"metadata":{},"requestId":"1f69d548-fd1d-4cbd-92d8-11fe4cd05405"},"status":200}
```

<section class="right stomp"></section>
>The Ctrl-@ (^@) keyboard sequence inserts a zero byte into the stream. If you want to play the given samples, you need to send Ctrl-@ each time the `^@` is displayed.

The [RabbitMQ STOMP plugin](https://www.rabbitmq.com/stomp.html) implements the versions 1.0, 1.1 and 1.2 versions of the protocol.

By default, the STOMP service shippled with Kuzzle exposes itself on the port 61613.
