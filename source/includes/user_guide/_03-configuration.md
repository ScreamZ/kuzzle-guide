## Configure Kuzzle

### RC

Kuzzle relies on the [rc package](https://github.com/dominictarr/rc) for its configuration system.

Kuzzle configuration can be overridden in several ways, notably:

- using some environment variables prefixed with `kuzzle_`
- using a .kuzzlerc file

Please refer to [rc Readme](https://github.com/dominictarr/rc/blob/master/README.md) for more information on the 
different configuration possibilities.

### Configuration options

You can get a comprehensive list of configuration options from the [.kuzzlerc.sample file](https://github.com/kuzzleio/kuzzle/blob/master/.kuzzlerc.sample) 
at the root of Kuzzle installation path.

#### Typical variables to override

Here are some configurations that are likely to be customized:

- `server.http.port`: Kuzzle internal http port. Defaults to `7511`, which conflicts with Kuzzle proxy's one.
- `services.proxyBroker.host`: Kuzzle proxy host. Defaults to `api`.


### Examples

1. Using some environment variables

    ```
    kuzzle_server__http_port: 7510 \
    kuzzle_services__proxyBroker__host=<PROXY_HOST> \
    node bin/kuzzle start
    ```
    
    These variables can also easily be configured for [Docker-compose](https://docs.docker.com/compose/compose-file/#/environment) or [pm2](http://pm2.keymetrics.io/docs/usage/application-declaration/).
 
2. Using a custom `.kuzzlerc` file

    `/etc/kuzzle/config`, `/path/to/kuzzle/.kuzzlerc`, `$HOME/.kuzzlerc` or any other valid location:
    
    ```json
    {
       "server": {
         "http": {
           "port": 7510
         }
       },
       "services": {
         "db": {
           "host": "<ES_HOST>",
           "port": <ES_PORT>
         },
         "proxyBroker": {
           "host": "<PROXY_HOST>"
         }
       }
    }
    ```


