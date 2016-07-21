## Command line interface

Kuzzle embed a [Command line interface](https://en.wikipedia.org/wiki/Command-line_interface) which permit you to :

- Install dependencies _(plugins, npm dependencies, ...)_
- Run kuzzle
- Toggle on/off internal services _(logger, monitoring, writeEngine, ...)_
- Create first administrator
- Reset persisted data _(use with caution !)_

<aside class="warning">
If you have launched kuzzle with docker, you have to enter in the kuzzle container to run theses commands
</aside>

### Install dependencies

Before start kuzzle, you have to install his dependencies, 
to do that just run the following command in the root folder of your kuzzle installation

```bash
$ ./bin/kuzzle install
```

<aside class="notice">
The plugins configuration is located into 2 files: 
<ul>
    <li><code>config/defaultPlugins.json</code> which contains default plugins configuration embed with kuzzle</li>
    <li><code>config/customPlugins.json</code> which contains plugins configuration for your own installation</li>
</ul>
</aside>


### Start kuzzle

To run kuzzle, you just have to run :

```bash
$ ./bin/kuzzle start
```

<aside class="notice">
The start command have a lot of options which permit you to:
<ul>
    <li>change the port used by kuzzle</li>
    <li>reset the persistent layer before start</li>
    <li>import fixtures/mapping before start</li>
</ul>
<br />
To get the full list of available options, just type <code>./bin/kuzzle start --help</code>
</aside>

### Enable/Disable services

You can enable services in a running Kuzzle without restarting it with a simple command line:

```bash
$ ./bin/kuzzle enable <service> <PID|all>
```

Where:

- service is the Kuzzle service name you want to activate
- PID is the processus ID of the Kuzzle server or worker you want to control. Use 'all' if you want to broadcast a service activation to a Kuzzle server and all its workers.

You can disable a service with:

```bash
$ ./bin/kuzzle disable <service> <PID|all>
```

<aside class="notice">
All services containing a toggle() method can be activated or deactivated on the fly. Some vital services can not be toggled. 
</aside>

### Create the first administrative user account

You will need a first admin to connect to the back-office

```bash
$ ./bin/kuzzle createFirstAdmin
```

<aside class="notice">
This command is interactive and let you choose to reset the roles rights or not.
</aside>

### Reset Kuzzle

To empty the persistent data storage into kuzzle without restarting it, you have to run this command: 

```bash
$ ./bin/kuzzle likeAvirgin
```

#### Reset and add fixtures or mappings

You can perform a reset followed by a fixtures and/or mappings import by doing:

```bash
$ ./bin/kuzzle likeAvirgin --fixtures /path/to/the/fixtures/file.json --mappings /path/to/the/mappings/file.json
```

### Getting help

You can, of course, get some help by using the  `--help` option. 

Try those: 

```bash
$ ./bin/kuzzle --help
$ ./bin/kuzzle start --help
$ ./bin/kuzzle likeAvirgin --help
```
