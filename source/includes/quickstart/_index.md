# Quickstart

In this quickstart tutorial you will learn in a few steps how to launch your own Kuzzle server
and how to interact with it by indexing data (persisted data) and being informed when data is updated (pub/sub)

## Setup a Kuzzle server

### Prerequisites

- Docker, see [instruction here](https://docs.docker.com/engine/installation/)
- Docker-compose, see [intruction here](https://docs.docker.com/compose/install/)
- That's it

### Make your own compose file

<aside class="notice">
You don't have to clone kuzzle to use it.
</aside>

- Copy our [docker-compose.yml](https://raw.githubusercontent.com/kuzzleio/kuzzle/develop/docker-compose.yml) file in a directory

<aside class="notice">
You can also retrieve this file directly with curl/wget : <br />
<code>wget https://raw.githubusercontent.com/kuzzleio/kuzzle/master/docker-compose.yml</code>
</aside>

- run:

```bash
$ docker-compose up
```

<aside class="success">
Kuzzle is running on:
<ul>
    <li><code>localhost:7512</code> for <strong>Websocket</strong></li>
    <li><code>localhost:7511</code> for <strong>REST</strong></li>
</ul>
</aside>

_You can view/contribute to this compose file directly on [github](https://github.com/kuzzleio/kuzzle/blob/master/docker-compose.yml)_

<aside class="notice">
Read more on how to do a <a href="#install-on-linux">custom installation</a> for kuzzle on the basic guide
</aside>

## Setup a Kuzzle Backoffice

[![kuzzle's backoffice preview](https://raw.githubusercontent.com/kuzzleio/kuzzle-bo/master/docs/images/metrics.png)](https://raw.githubusercontent.com/kuzzleio/kuzzle-bo/master/docs/images/metrics.png)

Kuzzle has a backoffice which permit you to see, create, watch and manage everything you can do with kuzzle.

The backoffice is not mandatory to run kuzzle, and it's not incuded by default, the easiest way to use the kuzzle's backoffice is to add this section into your `docker-compose.yml` file:

```yml
kuzzleBo:
  image: kuzzleio/bo:latest
  ports:
    - "3000:3000"
  links:
    - kuzzle
```

<aside class="success">
Kuzzle's backoffice is running on <code>localhost:3000</code>
</aside>

<aside class="notice">
Read more on how to do a custom installation for the backoffice <a href="https://github.com/kuzzleio/kuzzle-bo#installation">on github</a>
</aside>

## Send your first "Hello World" document

We will show you how to persist a document into kuzzle with the [Javascript SDK](/sdk-documentation)

### Prerequisites

- NodeJS, see [instruction here](https://nodejs.org/en/download/) (> v4.3.1)
- A kuzzle server running
- That's it

### Create your first script to interact with kuzzle

- Install the [Javascript SDK](/sdk-documentation) with `npm install kuzzle-sdk`
- Create `create.js` file with :

```javascript
var Kuzzle = require('kuzzle-sdk')

// connection to the kuzzle server
var kuzzle = new Kuzzle('http://localhost:7512')

// create a reference to the data collection
var collection = kuzzle.dataCollectionFactory('myindex', 'mycollection')

// define the document itself
var document = {
    message: 'hello world'
}

// persist the document into the collection
collection.createDocument(document)
```

- Run your file with `node create.js`

<aside class="success">
You have persisted your first document into kuzzle
</aside>

_If you want to go further, you may read the [SDK Documentation](/sdk-documentation) part_

## Subscribe to data changes (pub/sub)

Kuzzle embeds real-time features allowing you to be informed on interactions made with kuzzle (data modifications, another user listening the same changes than you, ...).

Here we will show you how to be informed when a document, matching a query filter, is updated

### Prerequisites

- NodeJS, see [instruction here](https://nodejs.org/en/download/) (> v0.10)
- A kuzzle server running
- That's it

### Create your first script to let kuzzle interact with you

- Install the [Javascript SDK](/sdk-documentation) with `npm install kuzzle-sdk`
- Create `subscribe.js` file with :

```javascript
var Kuzzle = require('kuzzle-sdk')

// connection to the kuzzle server
new Kuzzle('http://localhost:7512')

// create a reference to the data collection
var collection = kuzzle.dataCollectionFactory('myindex', 'mycollection')

// define a filter
var filter = {
    exists: {
        field: 'message'
    }
}

// create a subscription on the collection matching given filters
collection.subscribe(filter, function(error, result) {
    // this function is called each time kuzzle notifies us with a document matching our filters
    console.log('message received from kuzzle:', result)
}
```

- Run your file with `node subscribe.js`

<aside class="success">
While your script is running you will be notified about document entering in your filter. <br/>
Try to run the <code>create.js</code> script <a href="#create-your-first-script-to-interact-with-kuzzle">previously created</a> to view the result.
</aside>
