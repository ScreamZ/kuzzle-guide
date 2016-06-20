## Install on Linux


### Using Docker

If you are running Docker and just want to get your own Kuzzle running, you can use the provided docker-compose file.

#### Prerequisites

* [Docker](https://docs.docker.com/installation/#installation)
* [Docker Compose](https://docs.docker.com/compose/install/)

<aside class="notice">
You don't have to clone kuzzle to use it.
</aside>

- Create a `docker-compose.yml` with:

```yml
kuzzle:
  image: kuzzleio/kuzzle:latest
  ports:
    - "7512:7512"
    - "7511:7511"
  links:
    - elasticsearch
    - redis

redis:
  image: redis:3.0

elasticsearch:
  image: elasticsearch:2.2
```

<aside class="notice">
You can also retrieve this file directly with curl/wget : <br />
<code>wget https://raw.githubusercontent.com/kuzzleio/kuzzle/master/docker-compose.yml</code>
</aside>

- run: 

```bash
$ docker-compose up
```

#### Reset Kuzzle and insert some fixtures with Docker

If you need to get a fresh start with all persistent data erased and populate it with default fixtures, set the <code>FIXTURES</code> environment variable like:

```bash
$ FIXTURES=path/to/the/fixtures/file.json docker-compose up
```
    
examples:

```javascript
{
  "index": {
    "collection": [
      { "index": {} },
      { "a": "document", "with": "any", "number": "of fields" },
      { "index": {} },
      { "another": "document" },
      { "index": {} },
      { "and": { another: "one"} },
    ],
    "otherCollection": [
      { "index": {} },
      { "foo": "bar", "baz": {"bar": "foo"}, "done": true },
    ]
  },
  "otherindex": {
    "collection": [
      { "index": {} },
      { "...": "..." }
    ]
  }
}
```


Remember that the fixtures must be in the Docker container scope !

#### Initialize Kuzzle mapping with Docker

If you need to add a default mapping on Kuzzle start, set the <code>DEFAULT_MAPPING</code> environment variable like:

```bash
$ DEFAULT_MAPPING=path/to/the/mapping/file.json docker-compose up
```

examples:

```javascript
{
  "index": {
    "collection": [
      {
        "properties" : {
          "position" : {"type" : "geo_point" }
        }
      }
    ]
  }
}
```

Remember that the default mapping must be in the Docker container scope !

You can, of course, use all those option altogether like:

```bash
$ FIXTURES=fixtures/file.json DEFAULT_MAPPING=mapping/file.json docker-compose up
```

#### Useful tips


##### Updating kuzzle's containers

When you already have installed an old version of kuzzle, don't forget to update kuzzle's containers with:

```bash
$ docker-compose -f <docker-compose-file.yml> pull 
```

##### Updating kuzzle's dependencies 

To ensure that Kuzzle's dependencies are up-to-date, run the command directly without log-in into the container:

```bash
$ docker exec -ti <docker-compose-file.yml> run kuzzle npm install
$ docker exec -ti <docker-compose-file.yml> run kuzzle bin/kuzzle install
```


### Using Vagrant

If you are not running Docker on your system, for instance if you are running Windows or MacOs, you can pop a virtual machine to run Kuzzle.

Prerequisites:

* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* [Vagrant](https://www.vagrantup.com/)

From the root directory:

```bash
$ vagrant up
```

### Manual install

<aside class="notice">
we will assume that you want to launch Kuzzle and other services on the same host (localhost), but you can, of course, host kuzzle and any of its services on different hosts.
</aside> 

#### Prerequisites

* A service [Elasticsearch](https://www.elastic.co/products/elasticsearch) running on localhost:9200
* A service [Redis](http://redis.io/) running on localhost:6379
* A properly installed [nodeJs](https://nodejs.org/en/download/package-manager/) **version 4** or upper

#### Step one

Retrieve the Kuzzle proxy source code from the [GitHub repo](https://github.com/kuzzleio/kuzzle-proxy.git):

```bash
$ git clone https://github.com/kuzzleio/kuzzle-proxy.git
$ cd kuzzle-proxy
```

then install the dependencies:

```bash
$ npm install
$ npm run plugins
```

#### Step two

Start a proxy instance:

```bash
$ npm start
```

#### Step three

Retrieve the Kuzzle source code from the [GitHub repo](https://github.com/kuzzleio/kuzzle.git):

```bash
$ git clone https://github.com/kuzzleio/kuzzle.git
$ cd kuzzle
```

then install the dependencies:

```bash
$ npm install
```

#### Step four

Configure your environment. Kuzzle has been designed to be launched from inside a container, so the default hosts used to access to the ElasticSearch and Redis servers needs to be tweaked to hit the right hosts. If everything is hosted on localhost, you can use environment variable to overwrite default ones:

```bash
$ export READ_ENGINE_HOST=localhost:9200
$ export WRITE_ENGINE_HOST=localhost:9200
$ export CACHE_HOST=localhost
$ export CACHE_PORT=6379
```

#### Step five

Install the default plugins:

```bash
$ ./bin/kuzzle install
```

#### Finally

Start a server instance:

```bash
$ ./bin/kuzzle start --server
```

And then start as many worker instances as you want. At least one worker is required:

```bash
$ bin/kuzzle start --worker
```

For more information, you can execute:

```bash
$ bin/kuzzle start --help
```

#### All steps in one

```bash
# Proxy
$ git clone https://github.com/kuzzleio/kuzzle-proxy.git
$ cd kuzzle-proxy
$ npm install
$ npm run plugins
$ npm start

# Kuzzle
$ git clone https://github.com/kuzzleio/kuzzle.git
$ cd kuzzle
$ npm install
$ export READ_ENGINE_HOST=localhost:9200
$ export WRITE_ENGINE_HOST=localhost:9200
$ export CACHE_HOST=localhost
$ export CACHE_PORT=6379
$ ./bin/kuzzle install
$ ./bin/kuzzle start --server
$ ./bin/kuzzle start --worker
```

#### Run it again

To run kuzzle again, you will need to redo following steps (prerequisites are still need as well):

```bash
# Proxy
$ cd kuzzle-proxy
$ npm start

# Kuzzle
$ cd kuzzle
$ export READ_ENGINE_HOST=localhost:9200
$ export WRITE_ENGINE_HOST=localhost:9200
$ export CACHE_HOST=localhost
$ export CACHE_PORT=6379
$ ./bin/kuzzle start --server
$ ./bin/kuzzle start --worker
```

#### Going further

##### Command Line Interface

Kuzzle comes along with a [CLI](https://en.wikipedia.org/wiki/Command-line_interface)

To get a list of available options, you can run

```bash
$ ./bin/kuzzle start -h
```

##### Change external services hosts or ports

If you are running some of the service(s) externally, you can configure their host and port using some environment variables:

examples:

```bash
# Elastic Search (read/write engine):
$ export READ_ENGINE_HOST=myelasticsearch:9200
$ export WRITE_ENGINE_HOST=myelasticsearch:9200

# Redis (cache services):
$ export CACHE_HOST=myredis
$ export CACHE_PORT=6379

# Rabbit MQ (external broker for AMQP/MQTT/STOMP clients):
$ export MQ_BROKER_HOST=myrabbitmq
$ export MQ_BROKER_PORT=5672

$ ./bin/kuzzle start
```