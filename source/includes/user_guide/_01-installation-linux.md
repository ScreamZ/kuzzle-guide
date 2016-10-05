## Install on Linux


### Using Docker

If you are running Docker and just want to get your own Kuzzle running, you can use the provided docker-compose file.

#### Prerequisites

* [Docker](https://docs.docker.com/installation/#installation)
* [Docker Compose](https://docs.docker.com/compose/install/)

<aside class="notice">
You don't have to clone kuzzle to use it.
</aside>

- Get our official [`docker-compose.yml` file](https://github.com/kuzzleio/kuzzle/blob/master/docker-compose.yml):

```shell
wget https://raw.githubusercontent.com/kuzzleio/kuzzle/master/docker-compose.yml
```

- Run the following command:

```bash
$ docker-compose up
```

- Done!

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
We will assume that you want to launch Kuzzle and other services on the same host (localhost), but you can, of course, host kuzzle and any of its services on different hosts.
</aside>

The example given here will run the Kuzzle stack using [pm2](http://pm2.keymetrics.io/), from the current user home directory.

#### Prerequisites

* A service [Elasticsearch](https://www.elastic.co/products/elasticsearch) running on localhost:9200
* A service [Redis](http://redis.io/) running on localhost:6379
* A properly installed [nodeJs](https://nodejs.org/en/download/package-manager/) **version 4** or upper
* `gcc` and `python`. On Debian-based systems: `sudo apt-get install build-essential python`.

#### Step 1 - Retrieve Kuzzle components source code

1. Create kuzzle root path

    ```bash
    mkdir -p ~/kuzzle
    cd ~/kuzzle
    ```

2. Kuzzle proxy

    ```bash
    cd ~/kuzzle
    git clone https://github.com/kuzzleio/kuzzle-proxy.git
    cd kuzzle-proxy
    npm install
    npm run plugins
    ```

3. Kuzzle

    ```bash
    cd ~/kuzzle
    git clone https://github.com/kuzzleio/kuzzle.git
    cd kuzzle
    npm install
    node bin/kuzzle install
    ```

4. Kuzzle Back Office

    ```bash
    sudo npm install -g bower
    cd ~/kuzzle
    git clone https://github.com/kuzzleio/kuzzle-backoffice.git
    cd kuzzle-backoffice
    npm install
    bower install
    npm run build
    ```

#### Step 2 - pm2

1. Install pm2

    ```bash
    sudo npm install -g pm2
    ```

2. pm2 configuration  
     
     ```bash
     echo "apps:
       - name: kuzzle-proxy
         cwd: ${HOME}/kuzzle/kuzzle-proxy
         script: index.js
       - name: kuzzle
         cwd: ${HOME}/kuzzle/kuzzle
         script: bin/kuzzle
         args: start
         env:
           kuzzle_server__http__port: 7510
           kuzzle_services__proxyBroker__host: localhost
       - name: kuzzle-bo
         cwd: ${HOME}/kuzzle/kuzzle-backoffice
         script: node_modules/.bin/http-server
         args: -p 3000 dist/
      " > ~/kuzzle/pm2.conf.yml
      ```

3. run Kuzzle

    ```bash
    pm2 start ~/kuzzle/pm2.conf.yml
    pm2 logs
    1|kuzzle   |       ▄▄▄▄▄      ▄███▄      ▄▄▄▄
    1|kuzzle   |    ▄█████████▄▄█████████▄▄████████▄
    1|kuzzle   |   ██████████████████████████████████
    1|kuzzle   |    ▀██████████████████████████████▀
    1|kuzzle   |     ▄███████████████████████████▄
    1|kuzzle   |   ▄███████████████████████████████▄
    1|kuzzle   |  ▀█████████████████████████████████▀
    1|kuzzle   |    ▀██▀        ▀██████▀       ▀██▀
    1|kuzzle   |           ██     ████    ██
    1|kuzzle   |                 ▄████▄
    1|kuzzle   |                 ▀████▀
    1|kuzzle   |                   ▀▀
    1|kuzzle   |  ████████████████████████████████████
    1|kuzzle   |  ██         KUZZLE IS READY        ██
    1|kuzzle   |  ████████████████████████████████████
    1|kuzzle   | [ℹ] There is no administrator user yet. You can use the CLI or the back-office to create one.
    1|kuzzle   | [ℹ] Entering no-administrator mode: everyone has administrator rights.
    ```
    
Kuzzle Back-office can be reached on http://localhost:3000.  
Kuzzle REST API can be reached on http://localhost:7511/api/1.0/  
Socket IO and Websocket channels can respectively be reached on ports 7512 and 7513.

#### Going further

##### Command Line Interface

Kuzzle comes along with a [CLI](https://en.wikipedia.org/wiki/Command-line_interface)

To get a list of available options, you can run

```bash
$ ./bin/kuzzle start -h
```

##### Change external services hosts or ports

If you are running some of the service(s) externally, you can configure their host and port using some environment variables and/or a `.kuzzlerc` file.

Please refer to [Kuzzle configuration section](#configuration) for more information.
