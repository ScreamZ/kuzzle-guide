# ~ read controller

## count

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/_count`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  body: {
    // A set of filters or queries matching documents you're looking for.
    // Use 'query' instead of 'filter' if you want to perform a query instead.
    filter: {
      ...
    }
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
  controller: "read",
  action: "count",

  // A set of filters or queries matching documents you're looking for.
  // Use 'query' instead of 'filter' if you want to perform a query instead.
  body: {
    filter: {
      ...
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
  controller: "read",
  action: "count",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    count: <number of found documents>
  }
}
```

Given some filters, gets the number of matching documents from Kuzzle's data storage layer.

Kuzzle uses the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/1.3/query-dsl.html) syntax.

## get

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data collection>/<document Id>`  
>**Method:** `GET`  

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
  controller: "read",
  action: "get",


  // The document unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a document, or when you do a search query.
  _id: "<document ID>"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "read",
  action: "get",

  // The document unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a document, or when you do a search query.
  _id: "<document ID>"
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
  controller: "read",
  action: "get",

  // The document unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a document, or when you do a search query.
  _id: "<document ID>"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "read",
  action: "get",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id: "<Unique document ID>",    // The generated document ID
    _index: "<data index>",
    _type: "<data collection>",
    _version: 1,
    _source: {
      name: {
        first: "Steve",
        last: "Wozniak"
      },
      hobby: "Segway polo",
      ...
    }
  }
}
```

Given a `document id`, retrieve the corresponding document from the database.

Only documents in the persistent data storage layer can be retrieved.

## listCollections

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/_listCollections(/<all|stored|realtime>)`  
>**Method:** `GET`

<section class="amqp stomp"></section>
>**replyTo** header is **required**.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp stomp"></section>
```litcoffee
{
  index: "<data index>",
  controller: "read",
  action: "listCollections",
  body: {
    type: "<all|stored|realtime>"
  }
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session Id>",

  index: "<data index>",
  controller: "read",
  action: "listCollections",
  body: {
    type: "<all|stored|realtime>"
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  controller: "read",
  action: "listCollection",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    collections: {
      stored: [                     // An array of stored data collection names
        'collection_1',
        'collection_2',
        'collection_...',
        'collection_n'
      ],
      realtime: [                   // An array of stored data collection names
        'collection_1',
        'collection_2',
        'collection_...',
        'collection_n'
      ]
    },
    type: 'all'
  }
}
```

Return the complete list of realtime and stored  data collections in requested index.  
The `type` argument filters the returned collections. Allowed values: `all`, `stored` and `realtime` (default : `all`).

## listIndexes

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_listIndexes`  
>**Method:** `GET`

<section class="amqp stomp"></section>
>**replyTo** header is **required**.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp stomp"></section>
```litcoffee
{
  controller: "read",
  action: "listIndexes",
  body: {}
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session Id>",

  controller: "read",
  action: "listIndexes",
  body: {}
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  controller: "read",
  action: "listIndexes",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    total: 13,
    hits: [
      'index_1',
      'index_2',
      'index_...',
      'index_n'
    ]
  }
}
```

Return the complete data indexes.

## now

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_now`  
>**Method:** `GET`

<section class="amqp stomp"></section>
>**replyTo** header is **required**.

<section class="websocket amqp stomp"></section>
```litcoffee
{
  controller: "read",
  action: "now"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "read",
  action: "now"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  controller: "read",
  action: "now",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    now: 1447151167622              // Epoch time
  }
}
```

Return the the current Kuzzle UTC timestamp as Epoch time (number of milliseconds elapsed since 1 January 1970 00:00:00).

## search

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index/<data collection>/_search`  
>**Method:** `POST`  
>**Body:**

<section class="amqp stomp"></section>
>**replyTo** header is required

<section class="rest"></section>
```litcoffee
{
  body: {
    // A set of filters or queries matching documents you're looking for.
    // Use 'query' instead of 'filter' if you want to perform a query instead.
    filter: {

    },
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 42
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

  index: "<data index>",
  collection: "<data collection>",
  controller: "read",
  action: "search",

  body: {
    // A set of filters or queries matching documents you're looking for.
    // Use 'query' instead of 'filter' if you want to perform a query instead.
    filter: {

    },
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 42
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "read",
  action: "search",

  body: {
    // A set of filters or queries matching documents you're looking for.
    // Use 'query' instead of 'filter' if you want to perform a query instead.
    filter: {

    },
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 42
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

  index: "<data index>",
  collection: "<data collection>",
  controller: "read",
  action: "search",

  body: {
    // A set of filters or queries matching documents you're looking for.
    // Use 'query' instead of 'filter' if you want to perform a query instead.
    filter: {

    },
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 42
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
  action: "search",
  controller: "read",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    // An array of objects containing your retrieved documents
    hits: [
      {
        _id: "<document unique ID>",
        _score: "<document score>"
        _source: { .. }         // The actual document
      },
      {
        // Another document... and so on
      }
    ],
    total: <number of found documents>,
    max_score: 1,
    timed_out: false,
    took: 1
  }
}
```

Only documents in the persistent data storage layer can be searched.

Kuzzle uses the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/1.3/query-dsl.html) syntax.

## serverInfo



Retrieves information about Kuzzle, its plugins and active services.

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/_serverInfo`  
>**Method:** `GET`  

<section class="amqp stomp"></section>
>**replyTo** header is **required**.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp stomp"></section>
```litcoffee
{
  controller: "read",
  action: "serverInfo",
  body: {}
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session Id>",

  controller: "read",
  action: "serverInfo",
  body: {}
}
```

> Response

```litcoffee
{
  "kuzzle": {
    "api": {
      "routes": {
        "admin": [
          "deleteCollection",
          "putMapping",
          "getMapping",
          "getStats",
          "getLastStats",
          "getAllStats",
          "truncateCollection",
          "putRole",
          "deleteIndexes",
          "createIndex",
          "deleteIndex",
          "removeRooms"
        ],
        "auth": [
          "login"
        ],
        "bulk": [
          "import"
        ],
        "read": [
          "search",
          "get",
          "count",
          "listCollections",
          "now",
          "listIndexes",
          "serverInfo"
        ],
        "subscribe": [
          "on",
          "join",
          "off",
          "count",
          "list"
        ],
        "write": [
          "create",
          "publish",
          "createOrUpdate",
          "update",
          "delete",
          "deleteByQuery",
          "createCollection"
        ]
      },
      "version": "1.0"
    },
    "memoryUsed": 99901440,
    "nodeVersion": "v4.2.1",
    "plugins": {
      "kuzzle-plugin-auth-passport-local": {
        "activated": true,
        "hooks": [
          "auth:loadStrategies"
        ],
        "name": "kuzzle-plugin-auth-passport-local"
      },
      "kuzzle-plugin-logger": {
        "activated": true,
        "hooks": [
          "log:silly",
          "log:verbose",
          "log:info",
          "log:debug",
          "log:warn",
          "log:error",
          "data:*",
          "subscription:*",
          "websocket:*",
          "prepare:*",
          "cleanDb:done",
          "cleanDb:error",
          "server:*",
          "rabbit:started",
          "rabbit:error",
          "rabbit:stopped",
          "internalBroker:*",
          "room:new",
          "room:remove",
          "workerGroup:loaded",
          "profiling:*"
        ],
        "name": "kuzzle-plugin-logger",
        "version": "1.0.6"
      },
      "kuzzle-plugin-socketio": {
        "activated": true,
        "hooks": [
          "protocol:broadcast",
          "protocol:joinChannel",
          "protocol:leaveChannel"
        ],
        "name": "kuzzle-plugin-socketio",
        "version": "1.0.4"
      }
    },
    "system": {
      "cpus": [
        {
          "model": "Intel(R) Core(TM) i5-4310M CPU @ 2.70GHz",
          "speed": 800,
          "times": {
            "idle": 8859265400,
            "irq": 500,
            "nice": 4325300,
            "sys": 115447100,
            "user": 497028200
          }
        },
        {
          "model": "Intel(R) Core(TM) i5-4310M CPU @ 2.70GHz",
          "speed": 2701,
          "times": {
            "idle": 8848628800,
            "irq": 400,
            "nice": 3648100,
            "sys": 115458300,
            "user": 495154300
          }
        },
        {
          "model": "Intel(R) Core(TM) i5-4310M CPU @ 2.70GHz",
          "speed": 1300,
          "times": {
            "idle": 8875594600,
            "irq": 4200,
            "nice": 3956800,
            "sys": 98348100,
            "user": 538083800
          }
        },
        {
          "model": "Intel(R) Core(TM) i5-4310M CPU @ 2.70GHz",
          "speed": 2701,
          "times": {
            "idle": 8801022600,
            "irq": 0,
            "nice": 3946300,
            "sys": 97387200,
            "user": 552344400
          }
        }
      ],
      "memory": {
        "free": 1651486720,
        "total": 16729739264
      }
    },
    "uptime": "161016.824s",
    "version": "0.9.2"
  },
  "services": {
    "internalCache": {
      "memoryPeak": "4.88M",
      "memoryUsed": "4.88M",
      "mode": "standalone",
      "type": "redis",
      "version": "3.0.2"
    },
    "readEngine": {
      "api": "1.7",
      "lucene": "4.10.4",
      "nodes": {
        "count": {
          "client": 0,
          "data_only": 0,
          "master_data": 1,
          "master_only": 0,
          "total": 1
        },
        "fs": {
          "available": "5.5gb",
          "available_in_bytes": 5996474368,
          "free": "7.4gb",
          "free_in_bytes": 8013250560,
          "total": "36.5gb",
          "total_in_bytes": 39237341184
        },
        "jvm": {
          "max_uptime": "1.9d",
          "max_uptime_in_millis": 171087444,
          "mem": {
            "heap_max": "990.7mb",
            "heap_max_in_bytes": 1038876672,
            "heap_used": "51.8mb",
            "heap_used_in_bytes": 54394592
          },
          "threads": 75,
          "versions": [
            {
              "count": 1,
              "version": "1.8.0_66-internal",
              "vm_name": "OpenJDK 64-Bit Server VM",
              "vm_vendor": "Oracle Corporation",
              "vm_version": "25.66-b01"
            }
          ]
        },
        "os": {
          "available_processors": 4,
          "cpu": [
            {
              "cache_size": "3kb",
              "cache_size_in_bytes": 3072,
              "cores_per_socket": 16,
              "count": 1,
              "mhz": 2701,
              "model": "Core(TM) i5-4310M CPU @ 2.70GHz",
              "total_cores": 4,
              "total_sockets": 4,
              "vendor": "Intel"
            }
          ],
          "mem": {
            "total": "15.5gb",
            "total_in_bytes": 16729739264
          }
        },
        "plugins": [],
        "process": {
          "cpu": {
            "percent": 0
          },
          "open_file_descriptors": {
            "avg": 190,
            "max": 190,
            "min": 190
          }
        },
        "versions": [
          "1.5.2"
        ]
      },
      "spaceUsed": "14.5kb",
      "status": "red",
      "type": "elasticsearch",
      "version": "1.5.2"
    },
    { "etc." }
  }
}
```
