## Command line interface

Kuzzle embeds a [Command line interface](https://en.wikipedia.org/wiki/Command-line_interface) which enables you to:

* install and configure plugins
* run kuzzle
* toggle on/off internal services _(logger, monitoring, writeEngine, ...)_
* create a first administrator user
* reset kuzzle internal data _(use with caution !)_

<aside class="warning">
If you used docker to start Kuzzle, you will have to enter the kuzzle container to run theses commands.
</aside>

```
$ ./bin/kuzzle

  Usage: kuzzle [options] [command]


  Commands:

    createFirstAdmin [options]   create the first administrator user
    disable [options]            disable a service without reloading Kuzzle
    enable [options]             enable a service without reloading Kuzzle
    install                      install all plugins configured in .kuzzlerc
    likeAvirgin [options]        delete Kuzzle configuration and users from database. Makes Kuzzle look like a virgin, touched for the very first time
    plugins [options] [name]     manage plugins
    start [options]              start a Kuzzle instance
  Options:

    -h, --help      output usage information
    -V, --version   output the version number
    -d, --debug     make errors more verbose
    -C, --noColors  do not use ANSI coloring
```

### createFirstAdmin

```
$ ./bin/kuzzle createFirstAdmin
```

When Kuzzle runs for the first time, no users are defined and the anonymous user is granted with super admin rights.

The `createFirstAdmin` command lets you define an administrator user and set your own permissions. 

<aside class="notice">NB: This command can only be run interactively</aside>

### disable

<aside class="warning">This command is deprecated and will be removed in next Kuzzle release.</aside>

```bash
$ ./bin/kuzzle disable <service>
```

### enable

<aside class="warning">This command is deprecated and will be removed in next Kuzzle release.</aside>

```bash
$ ./bin/kuzzle enable <service>
```

### install

Kuzzle is dependent on some external plugins.  
These need to be installed before Kuzzle is started.

```bash
$ ./bin/kuzzle install
```

The `install` command will install the plugins listed in the `.kuzzlerc` file.  
The configuration of the plugin can be edited using Kuzzle CLI.

Please refer to [Kuzzle plugin documentation](#plugins) for more information about how to use and configure plugins.

### likeAvirgin

<aside class="warning">NB: This command has some destructive effect. Use it with care</aside>

```
$ ./bin/kuzzle likeAvirgin --help
  
    Usage: likeAvirgin [options]
  
    delete Kuzzle configuration and users from database. Makes Kuzzle look like a virgin, touched for the very first time
  
    Options:
  
      -h, --help             output usage information
      --fixtures <fixtures>  import some fixtures from file
      --mappings <mappings>  load and apply mappings from file
      --noint                non interractive mode, will perform the reset immediately
```

The `likeAvirgin` command deletes all currently set configurations and the users from the database.

If some business data were imported in Kuzzle database layer, these are kept intact.

Its main purpose is to be used during early development cycles to iterate some new tries.

### plugins

Please refer to the [dedicated plugin CLI documentation](#managing-plugins-using-the-cli).

### start

```
$ ./bin/kuzzle start --help
  
    Usage: start [options]
  
    start a Kuzzle instance
  
    Options:
  
      -h, --help                 output usage information
      -p, --port <port>          Kuzzle port number
          --likeAvirgin          delete Kuzzle configuration and users from database
          --fixtures <fixtures>  import some fixtures from file
          --mappings <mappings>  load and apply mappings from file
```

The `start` command starts a Kuzzle instance in the foreground.


