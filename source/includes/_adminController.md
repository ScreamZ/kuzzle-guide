# ~ admin controller

## createIndex

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>`  
>**Method:** `PUT`

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  controller: "admin",
  action: "createIndex"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  action: "createIndex",
  controller: "admin",
  state: "done",
  requestId: "<unique request identifier>"',
  result: {
    "acknowledged": true
  }
}
```
When creating a document or a collection, Kuzzle will automatically create a data index if needed.  
But in some cases, you may want to create an empty index directly, prior to storing any document in it.

Create an `index` in Kuzzle's persistent storage layer.

## deleteCollection

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>`  
>**Method:** `DELETE`

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "admin",
  action: "deleteCollection",
  index: "<data index>",
  collection: "<data collection>"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  action: "deleteCollection",
  controller: "admin",
  state: "done",
  requestId: "<unique request identifier>"',
  result: {}
}
```

Deletes an entire `collection` from Kuzzle's persistent storage layer.

## deleteIndex

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>`  
>**Method:** `DELETE`

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  controller: "admin",
  action: "deleteIndex"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  controller: "admin",
  action: "deleteIndex",
  state: "done",
  requestId: "<unique request identifier>"',
  result: {
    "acknowledged": true
  }
}
Deletes an entire `index` from Kuzzle's persistent storage layer.
```

## deleteIndexes

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_deleteIndexes`  
>**Method:** `DELETE`

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "admin",
  action: "deleteIndexes",
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  action: "deleteIndexes",
  controller: "admin",
  state: "done",
  requestId: "<unique request identifier>"',
  result: {deleted:["index1","index2"]}  // list of actual deleted indexes
}
Deletes all `indexes`, that current user is allowed to delete, from Kuzzle's persistent storage layer.

That means: if Kuzzle contains indexes "index1", "index2" and "index3", but current user is only allowed to delete "index1" and "index2", only both of them are deleted, and "index3" is kept in the persistent storage layer.

The response contains the list of indexes that have been actually deleted.
```

## getAllStats

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_getAllStats`  
>**Method:** `GET`

<section class="amqp stomp"></section>
>**replyTo** header is **required**

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp stomp"></section>
```litcoffee
{
  controller: "admin",
  action: "getAllStats"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>,

  controller: "admin",
  action: "getAllStats"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  action: "getAllStats",
  controller: "admin",
  state: "done",
  // The requestId field you provided.
  requestId: "<unique request identifier>",
  result: {
    total: 25,
    hits: [
      {
        completedRequests: {
          websocket: 148,
          rest: 24,
          mq: 78
        },
        failedRequests: {
          websocket: 3
        },
        ongoingRequests: {
          mq: 8,
          rest: 2
        }
        connections: {
          websocket: 13
        },
        "timestamp": "1453110641308"
      },
      ...
    ]
  }
}
```
Kuzzle monitors its internal activities and make snapshots regularly. This command allows getting all the stored statistics.  
By default, snapshots are made every 10s, and these snapshots are stored for 1hr.

These statistics include:

* the number of connected users per protocol for the ones which allow to get this information (websocket, udp, ...)
* the number of ongoing requests
* the number of completed requests since the last frame
* the number of failed requests since the last frame

Statistics are returned as a JSON-object with each key being the snapshot's timestamp (utc, in milliseconds).

## getLastStats

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_getLastStats`  
>**Method:** `GET`

<section class="amqp stomp"></section>
>**Topic:** `admin.getLastStats`  
>**replyTo** header is **required**

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp stomp"></section>
```litcoffee
{
  controller: 'admin',
  action: 'getLastStats'
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "admin",
  action: "getLastStats"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  action: "getLastStats",
  controller: "admin",
  state: "done",
  // The requestId field you provided.
  requestId: "<unique request identifier>",
  result: {
    completedRequests: {
      websocket: 148,
      rest: 24,
      mq: 78
    },
    failedRequests: {
      websocket: 3
    },
    ongoingRequests: {
      mq: 8,
      rest: 2
    }
    connections: {
      websocket: 13
    },
    "timestamp": "1453110641308"
  }
}
```

Kuzzle monitors its internal activities and make snapshots regularly. This command allows getting the last stored statistics frame.  
By default, snapshots are made every 10s.

These statistics include:

* the number of connected users per protocol for the ones which allow to get this information (websocket, udp, ...)
* the number of ongoing requests
* the number of completed requests since the last frame
* the number of failed requests since the last frame

Statistics are returned as a JSON-object with each key being the snapshot's timestamp (utc, in milliseconds).

## getMapping

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/_mapping`  
>**Method:** `GET`

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "admin",
  action: "getMapping"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  index: "<data index>",
  collection: "<data collection>",
  controller: "admin",
  action: "getMapping"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "admin",
  action: "getMapping",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    mainindex: {
      mappings: {
        <data collection>: {

          // Data mapping using ElasticSearch mapping syntax
          properties: {
            field1: {type: "field type", ...options... },
            field2: {type: "field type", ...options... },
            ...
            fieldn: {type: "field type", ...options... },
          }
        }
      }
    }
  }
}
```

Gets the mapping of the given `collection`.


## getStats

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_getStats`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  // Optional: Kuzzle will return all statistics if nor the startTime and stopTime are defined
  body: {
    startTime: <timestamp>,
    stopTime: <timestamp>
  }
}
```

<section class="amqp stomp"></section>
>**Topic:** `admin.getStats`  
>**Exchange name:** `amq.topic`  
>**replyTo** header is **required**.

<section class="mqtt"></section>
>**Topic:** `admin.getStats`

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  controller: "admin",
  action: "getStats",

  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  // Optional: Kuzzle will return all statistics if nor the startTime and stopTime are defined
  body: {
    startTime: <timestamp>,
    stopTime: <timestamp>
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  // Optional
  clientId: "<Unique session Id>",

  // Optional: Kuzzle will forward this field in its response, allowing you
  // to easily identify which query generated the response you got.
  requestId: "<Unique query ID>",

  // Optional: Kuzzle will return all statistics if nor the startTime and stopTime are defined
  body: {
    startTime: <timestamp>,
    stopTime: <timestamp>
  }
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  clientId: "<Unique session Id>",

  // Optional: Kuzzle will forward this field in its response, allowing you
  // to easily identify which query generated the response you got.
  requestId: "<Unique query ID>",

  // Optional: Kuzzle will return all statistics if nor the startTime and stopTime are defined
  body: {
    startTime: <timestamp>,
    stopTime: <timestamp>
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  action: "getStats",
  controller: "admin",
  state: "done",
  // The requestId field you provided.
  requestId: "<unique request identifier>",
  result: {
    total: 25,
    hits: [
      {
        completedRequests: {
          websocket: 148,
          rest: 24,
          mq: 78
        },
        failedRequests: {
          websocket: 3
        },
        ongoingRequests: {
          mq: 8,
          rest: 2
        }
        connections: {
          websocket: 13
        },
        "timestamp": "1453110641308"
      },
      ...
    ]
  }
}
```

This command allows getting statistics frames saved/stored after a provided timestamp (utc, in milliseconds).

These statistics include:

* the number of connected users per protocol for the ones which allow to get this information (websocket, udp, ...)
* the number of ongoing requests
* the number of completed requests since the last frame
* the number of failed requests since the last frame

Statistics are returned as a JSON-object with each key being the snapshot's timestamp (utc, in milliseconds).

## updateMapping

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/_mapping`  
>**Method:** `PUT`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  // Data mapping using ElasticSearch mapping syntax
  properties: {
    field1: {type: "field type", ...options... },
    field2: {type: "field type", ...options... },
    ...
    fieldn: {type: "field type", ...options... },
  }
}
```

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "admin",
  action: "updateMapping",

  // Data mapping using ElasticSearch mapping syntax
  body: {
    properties: {
      field1: {type: "field type", ...options... },
      field2: {type: "field type", ...options... },
      ...
      fieldn: {type: "field type", ...options... },
    }
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  action: "updateMapping",
  controller: "admin",
  state: "done",
  requestId, "<unique request identifier>",
  result: {}
}
```

When creating a new data `collection` in the persistent data storage layer, Kuzzle uses a default mapping.  
It means that, by default, you won't be able to exploit the full capabilities of our persistent data storage layer (currently handled by [ElasticSearch](https://www.elastic.co/products/elasticsearch)), and your searches may suffer from below-average performances, depending on the amount of data you stored in a collection and the complexity of your database.

To solve this matter, Kuzzle's API offers a way to create data mapping and to expose the entire [mapping capabilities of ElasticSearch](https://www.elastic.co/guide/en/elasticsearch/reference/1.3/mapping.html).


## truncateCollection

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<collection name>/_truncate`  
>**Method:** `DELETE`

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "admin",
  action: "truncateCollection"
}
```

>Response

```litcoffee
{
  status: 200,
  error: null,
  action: "truncateCollection",
  controller: "admin",
  index: "<data index>",
  collection: "<data collection>",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    acknowledged: true,
  }
}
```

This method empties a collection from all its documents, while keeping any associated mapping.  
It is also way faster than deleting all documents from a collection using a query.
