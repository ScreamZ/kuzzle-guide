# ~ bulk controller

A bulk import allows your application to perform multiple writing operations thanks to a single query. This is especially useful if you want to create a large number of documents. A bulk import will be a lot faster compared to creating them individually using `create` queries.  
For other queries, the syntax for bulk imports closely resembles the [ElasticSearch Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/1.3/docs-bulk.html?q=bulk).

<aside class="warning">
The bulk operations only apply to the persistent data storage layer. You <strong>won't receive any real-time notfications</strong> on your document subcriptions even if some of the documents in the import match your subscription filters.
</aside>

## import

<div></div>
### Performing a bulk import on a data collection

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/<data index>/<data collection>/_bulk`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  body {
    // Data mapping using ElasticSearch bulk syntax.
    [
      {create: {}},
      { a: "document", with: "any", number: "of fields" },
      {create: {}},
      { another: "document" },
      {create: {}},
      { and: { another: "one"} },
      ...
    ]
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
  controller: "bulk",
  action: "import",

  // Data mapping using ElasticSearch bulk syntax.
  body: [
    {create: {}},
    { a: "document", with: "any", number: "of fields" },
    {create: {}},
    { another: "document" },
    {create: {}},
    { and: { another: "one"} },
    ...
  ]
}
```
>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "bulk",
  action: "import",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    // The list of executed queries, with their status
    hits: [
      { create: {
          _id: "<document Id>",
          status: <HTTP status code>
        }
      },
      { create: {
          _id: "<document ID>",
          status: <HTTP status code>
        }
      },
      { create: {
          _id: "<document Id>",
          status: <HTTP status code>
        }
      }
    ]
  }
}
```

You can use the `bulk import` to save a list of documents in one specific `collection` in a specified `index`.

In such case, the `collection` in which the documents need to be inserted needs to be specified in the query.

<div></div>
### Performing a global bulk import

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_bulk`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  // Data mapping using ElasticSearch bulk syntax.
  body: [
    {create: {"_index": "<data index>", "_type": "<data collection>"}},
    { a: "document", with: "any", number: "of fields" },
    {create: {"_index": "<data index>", "_type": "<data collection>"}},
    { another: "document" },
    {create: {"_index": "<data index>", "_type": "<data collection>"}},
    { and: { another: "one"} },
    ...
    {create: {"index": { "_index": "<another data index>", "_type": "<another data collection>" }}},
  ]
}
```

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "bulk",
  action: "import",

  // Data mapping using ElasticSearch bulk syntax.
  body: [
    {create: {"_index": "<data index>", "_type": "<data collection>"}},
    { a: "document", with: "any", number: "of fields" },
    {create: {"_index": "<data index>", "_type": "<data collection>"}},
    { another: "document" },
    {create: {"_index": "<data index>", "_type": "<data collection>"}},
    { and: { another: "one"} },
    ...
    {create: {"index": { "_index": "<another data index>", "_type": "<another data collection>" }}},
  ]
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  controller: "bulk",
  action: "import",
  state: "done",
  // The requestId field you provided.
  requestId: "<unique request identifier>",
  result: {
    // The list of executed queries, with their status
    hits: [
      { create: {
          _id: "<document Id>",
          status: <HTTP status code>
        }
      },
      { create: {
          _id: ""<document Id>",
          status: <HTTP status code>
        }
      },
      { create: {
          _id: "<document Id>",
          status: <HTTP status code>
        }
      }
    ]
  }
}
```

The `bulk import` can also be used in a more versatile (yet a little more verbose) way, to execute operations on a whole database, modifying multiple data collections in different indexes at once.

The `collections` to modify then need to be specified inside the query message, using the `_type`argument, as specified in the [ElasticSearch Bluk API](https://www.elastic.co/guide/en/elasticsearch/reference/1.3/docs-bulk.html?q=bulk).
