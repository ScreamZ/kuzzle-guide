## Managing plugins using the CLI

Plugins can be managed using the Kuzzle command-line interface:

```sh
$ ./bin/kuzzle plugins --help
  
    Usage: plugins [options] [name]
  
    manage plugins
  
    Options:
  
      -h, --help                  output usage information
          --list                  list currently installed plugins
          --install               if plugin [name] is provided, install it from --npmVersion, --gitUrl or --path, otherwise, (re-)install all listed plugins
          --remove                removes plugin [name] from Kuzzle
          --activate              mark the plugin as "activated" (Kuzzle ignores deactivated plugins)
          --deactivate            mark the plugin as "deactivated" (Kuzzle ignores deactivated plugins)
          --importConfig <file>   import a configuration from a file for a given plugin
          --get                   get plugin [name] configuration stored in Kuzzle
          --set <JSONObject>      merge current plugin configuration with JSONObject
          --unset <property>      unset property from the plugin configuration
          --replace <JSONObject>  erase the plugin configuration and apply JSONObject instead
      -v, --npmVersion <version>  install plugin <version> from npm
      -u, --gitUrl <url>          install plugin from a git repository
      -p, --path <path>           install plugin from the file system

```

<aside class="warning">Restarting Kuzzle is required to apply any change made to plugins using the command-line interface</aside>

### > List installed plugins

You can get an overview of installed plugins and their activation status using the ``--list`` option:

```
./bin/kuzzle plugins --list
{ 'kuzzle-plugin-auth-passport-local': 
   { npmVersion: '2.0.3',
     activated: true,
     config: 
      { secret: 'changeme',
        algorithm: 'sha1',
        digest: 'hex' } },
  'kuzzle-plugin-logger': 
   { npmVersion: '2.0.2',
     activated: true,
     config: 
      { services: 
         { file: 
            { outputs: 
               { error: { level: 'error', filename: 'kuzzle-error.log' },
                 warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
              addDate: true },
           stdout: { level: 'info', addDate: true } } } }
```

### > Install a plugin

Kuzzle CLI is able to install a plugin from the NPM public registry, from a GIT repository, or from a plain directory accessible to Kuzzle instances.  
The corresponding installation options are: `--npmVersion`, `--gitUrl` and `--path`.

<aside class="notice">When installing a plugin from a directory path, make sure that all its dependencies have also been installed.</aside>

Without a plugin `name` argument, the CLI will re-install (if needed) and refresh plugins configuration of all currently registered plugins.

Here are a few examples to install and register plugins to Kuzzle:

**Using NPM:**

```sh
$ kuzzle plugins --install --npmVersion x.y.z plugin_name
```

**Using a GIT repository:**

```sh
$ kuzzle plugins --install --gitUrl https://git.repository.url/project/pluginsRepository plugin_name
```

**Using a local directory:**

```sh
$ kuzzle plugins --install --path /directory/absolute/path plugin_name
```

### > View plugin configuration

To view a plugin configuration, use the `--get` option.

```
$ ./bin/kuzzle plugins --get kuzzle-plugin-logger
{ npmVersion: '2.0.2',
  activated: true,
  config: 
   { services: 
      { file: 
         { outputs: 
            { error: { level: 'error', filename: 'kuzzle-error.log' },
              warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
           addDate: true },
        stdout: { level: 'info', addDate: true } } } }
```

### > Modify a plugin configuration

Plugins configurations are stored in the `config` part of plugins properties.

There are multiple ways of changing a plugin configuration.

You can either:

* perform a partial update, using the ``--set`` action. This allows adding or updating parts of the configuration
* replace the entire plugin configuration on the command-line, with the ``--replace`` action
* replace the entire plugin configuration by loading a JSON file, with the ``--importConfig <file>`` action

Updating a plugin configuration:

```
$ ./bin/kuzzle plugins --get kuzzle-plugin-logger
 { npmVersion: '2.0.2',
   activated: true,
   config: 
    { services: 
       { file: 
          { outputs: 
             { error: { level: 'error', filename: 'kuzzle-error.log' },
               warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
            addDate: true },
         stdout: { level: 'info', addDate: true } } } }
$ ./bin/kuzzle plugins --set '{ "stdout": { "level": "debug"} }' kuzzle-plugin-logger
  { npmVersion: '2.0.2',
    activated: true,
    config: 
     { services: 
        { file: 
           { outputs: 
              { error: { level: 'error', filename: 'kuzzle-error.log' },
                warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
             addDate: true },
          stdout: { level: 'debug' } } } }
```

Replacing a plugin configuration on the command-line:

```
$ ./bin/kuzzle plugins --get kuzzle-plugin-logger
 { npmVersion: '2.0.2',
   activated: true,
   config: 
    { services: 
       { file: 
          { outputs: 
             { error: { level: 'error', filename: 'kuzzle-error.log' },
               warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
            addDate: true },
         stdout: { level: 'info', addDate: true } } } }
$ ./bin/kuzzle plugins --replace '{"stdout": {"level": "debug", "addDate": true}}' kuzzle-plugin-logger
  { npmVersion: '2.0.2',
    activated: true,
    config: { stdout: { level: 'debug', addDate: true } } }
```

Replacing a plugin configuration using a JSON file:

```
$ ./bin/kuzzle plugins --importConfig foo.json kuzzle-plugin-logger
[✔] Successfully imported configuration
$ ./bin/kuzzle plugins --get kuzzle-plugin-logger
{ npmVersion: '2.0.2', activated: true, config: { foo: 'bar' } }
```


### > Removing a plugin configuration property

You can remove a plugin configuration property by using the ``--unset`` action:

```
$ ./bin/kuzzle plugins --get kuzzle-plugin-logger
{ npmVersion: '2.0.2',
  activated: true,
  config: 
   { services: 
      { file: 
         { outputs: 
            { error: { level: 'error', filename: 'kuzzle-error.log' },
              warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
           addDate: true },
        stdout: { level: 'info', addDate: true } } } }
$ ./bin/kuzzle plugins --unset 'services' kuzzle-plugin-logger
  { npmVersion: '2.0.2',
    activated: true }
```
<aside class="notice">NB: Only root properties can be unset</aside>

### > Uninstalling a plugin

Plugins can be uninstalled using the ``--remove`` option. If the plugin has been installed from NPM or from a GIT repository, the plugin installation directory will also be deleted.

```sh
$ kuzzle plugins --remove kuzzle-plugin-socketio
$
```

### > Activating/Deactivating a plugin

By default, a plugin is activated when installed, meaning it will be loaded and used by Kuzzle on the next restart.

You may want to activate or deactivate a plugin, without uninstalling it.

To deactivate a plugin:

```
./bin/kuzzle plugins --deactivate kuzzle-plugin-logger
{ npmVersion: '2.0.2',
  activated: false,
  config: 
   { services: 
      { file: 
         { outputs: 
            { error: { level: 'error', filename: 'kuzzle-error.log' },
              warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
           addDate: true },
        stdout: { level: 'info', addDate: true } } } }
```


To activate a plugin:

```
$ ./bin/kuzzle plugins --activate kuzzle-plugin-logger
  { npmVersion: '2.0.2',
    activated: true,
    config: 
     { services: 
        { file: 
           { outputs: 
              { error: { level: 'error', filename: 'kuzzle-error.log' },
                warning: { level: 'warn', filename: 'kuzzle-warning.log' } },
             addDate: true },
          stdout: { level: 'info', addDate: true } } } }
```

