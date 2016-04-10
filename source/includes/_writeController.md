# ~ write controller

## create

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/_create`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
    // The message to send
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "create",

  body: {
    // the document to create
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
  controller: "write",
  action: "create",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    _id: "<Unique document ID>",    // The generated document ID
    _version: 1                     // The version of the document in the persistent data storage
    _source: {                      // The created document
      ...
    },
  }
}
```

Creates a new document in the persistent data storage.

Returns an error if the document already exists.

## createCollection

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<collection name>`  
>**Method:** `PUT`

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<collection name>",
  controller: "write",
  action: "createCollection"
}
```

>Response

```litcoffee
{
  status: 200,
  error: null,
  index: "<data index>",
  collection: "<collection name>",
  controller: "write",
  action: "createCollection",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    acknowledged: true
  }
}
```

When creating a document, Kuzzle will automatically create a data collection if needed.  
But in some cases, you may want to create an empty collection directly, prior to storing any document in it.

This method does nothing if the collection already exists.

## createOrReplace

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/<documentId>` or `http://kuzzle:7511/api/1.0/<data index>/<data collection>/<documentId>/_createOrReplace`  
>**Method:** `PUT`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
    // The document to update
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "createOrReplace",

  // The document itself
  body: {
    ...
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
  controller: "write",
  action: "createOrReplace",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    _id: "<Unique document ID>",    // The generated document ID
    _source: {                      // The created document
      ...
    },
    _version: <number>,             // The new version number of this document
    created: <boolean>              // true: a new document has been created, false: the document has been updated
  }
}
```

Creates a new document in the persistent data storage, or replaces it if it already exists.

## delete

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/<documentID>`  
>**Method:** `DELETE`

<section class="amqp stomp"></section>
>**replyTo** header is optional

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "delete",

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
  controller: "write",
  action: "delete",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id: "<document ID>"            // The deleted document identifier
  }
}
```

Given a `documentId`, deletes the corresponding document from Kuzzle's database.

Only documents in the persistent data storage layer can be deleted.

## deleteByQuery

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/_query`  
>**Method:** `DELETE`  
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
  controller: "write",
  action: "deleteByQuery",

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
  controller: "write",
  action: "deleteByQuery",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    // Array of strings listing the IDs of removed documents
    hits: ["id1", "id2", ..., "idn"]
  }
}
```

Deletes all the documents matching the given filter or query from Kuzzle's database.

Kuzzle uses the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/1.3/query-dsl.html) syntax.

## publish

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
    // The message to send
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "publish",
  // The document itself
  body: {
    ...
  }
}
```

>Response

```litcoffee
{
  error: null,
  status: 200,
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "publish",
  state: "done",
  metadata: {},
  requestId: "<unique request identifier>",
  result: {}  
}
```

Sends a real-time message to Kuzzle. The message will be dispatched to all the clients who have subscribed to a subscription for which the filters match the message content.

The message is **not** persisted in the database.

## replace

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/<documentId>/_replace`
>**Method:** `PUT`
>**Body:**

<section class="rest"></section>
```litcoffee
{
    // The document to update
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "replace",

  // The document itself
  body: {
    ...
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
  controller: "write",
  action: "replace",
  state: "done",
  requestId: "<unique request identifier>",
  result: {
    _id: "<Unique document ID>",    // The document unique ID
    _source: {                      // The resulting document
      ...
    },
    _version: <number>,             // The new version number of this document
    created: false
  }
}
```

Replaces an existing document in the persistent data storage. Only documents in the persistent data storage layer can be replaced.

## update

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/<documentId>/_update`  
>**Method:** `PUT`  
>**Body:**

<section class="amqp stomp"></section>
>**replyTo** header is required

<section class="rest"></section>
```litcoffee
{
  field_to_update1: "new value",
  field_to_update2: "new value",
  ...
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  index: "<data index>",
  collection: "<data collection>",
  controller: "write",
  action: "update",

  // The document unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a document, or when you do a search query.
  _id: '<document ID>'

  // The actual update query
  body: {
    field_to_update1: "new value",
    field_to_update2: "new value",
    ...
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
  controller: "write",
  action: "update",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id:
  }
}
```

Only documents in the persistent data storage layer can be updated.
