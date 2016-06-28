## Managing plugins using the CLI

Plugins can be managed using the Kuzzle command-line interface:

```sh
$ kuzzle plugins --help

Usage: plugins [options] [name]

Manage plugins

Options:

  -h, --help                  output usage information
  --list                      *List currently installed plugins
  --install                   *If plugin [name] is provided, installs it using --npmVersion, --gitUrl or --path. Otherwise, (re-)installs all listed plugins
  --get                       *Gets the plugin [name] current stored configuration
  --set <JSONObject>          *Updates the plugin configuration with new properties
  --replace <JSONObject>      *Replaces a plugin configuration with a new one
  --unset <property>          *Deletes the property [property] from the plugin configuration
  --remove                    *Removes the supplied plugin [name] from Kuzzle
  --activate                  *Marks the plugin as "activated" (Kuzzle ignores deactivated plugins)
  --deactivate                *Marks the plugin as "deactivated" (Kuzzle ignores deactivated plugins)
  --importConfig <file>       *Imports a configuration from a file for a given plugin
  -v, --npmVersion <version>  Installs plugin <version> from NPM (work only with --install)
  -u, --gitUrl <url>          Installs plugin from a GIT repo <url> (work only with --install)
  -p, --path <path>           Installs a plugin from directory <path> (work only with --install)
```

<aside class="warning">Restarting Kuzzle is required to apply any change made to plugins using the command-line interface</aside>

### > List installed plugins

You can get an overview of installed plugins and their activation status using the ``--list`` option:

```sh
$ kuzzle plugins --list
kuzzle-plugin-auth-passport-local (activated)
kuzzle-plugin-logger (activated)
kuzzle-plugin-auth-passport-oauth (disabled)
```

### > Install a plugin

Kuzzle CLI is able to install a plugin from the NPM public registry, from a GIT repository, or from a plain directory accessible to Kuzzle instances.  
The corresponding installation options are: `--npmVersion`, `--gitUrl` and `--path`.

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


Example:

```sh
$ kuzzle plugins --get kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { port: 7512, room: 'kuzzle', loadedBy: 'server' } }
```

### > Modify a plugin configuration

Plugins configurations are stored in the `config` part of plugins properties.

There are multiple ways of changing a plugin configuration.

You can either:

- perform a partial update, using the ``--set`` action. This allows adding or updating parts of the configuration
- replace the entire plugin configuration on the command-line, with the ``--replace`` action
- replace the entire plugin configuration by loading a JSON file, with the ``--importConfig <file>`` action

Updating a plugin configuration:

```sh
$ kuzzle plugins --get kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { port: 7512, room: 'kuzzle', loadedBy: 'server' } }

$ kuzzle plugins --set '{"room": "foobar", "foo": "bar"}' kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { room: 'foobar', port: '7512', loadedBy: 'server', foo: 'bar' } }
```

Replacing a plugin configuration on the command-line:

```sh
$ kuzzle plugins --get kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { port: 7512, room: 'kuzzle', loadedBy: 'server' } }

$ kuzzle plugins --replace '{"foo": "bar"}' kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { foo: 'bar' } }
```

Replacing a plugin configuration using a JSON file:

```sh
$ cat someConfigurationFile.json
{
  "room": "foobar",
  "foo": "bar",
  "port": 7512,
  "loadedBy": "server"
}

$ kuzzle plugins --importConfig someConfigurationFile.json kuzzle-plugin-socketio
[✔] Successfully imported configuration

$ kuzzle plugins --get kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { port: 7512, room: 'foobar', loadedBy: 'server', foo: 'bar' } }
```

### > Removing a plugin configuration property

You can remove a plugin configuration property by using the ``--unset`` action:

```sh
$ kuzzle plugins --get kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { port: 7512, room: 'kuzzle', loadedBy: 'server' } }

$ kuzzle plugins --unset room kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { port: '7512', loadedBy: 'server' } }
```

### > Uninstalling a plugin

Plugins can be uninstalled using the ``--remove`` option. If the plugin has been installed from NPM or from a GIT repository, the plugin installation directory will also be deleted.

```sh
$ kuzzle plugins --remove kuzzle-plugin-socketio
███ kuzzle-plugin: Loading Kuzzle configuration...
███ kuzzle-plugin: Removing plugin kuzzle-plugin-socketio...
███ kuzzle-plugin: Plugin configuration deleted
███ kuzzle-plugin: Plugin directory deleted
```

### > Activating/Deactivating a plugin

By default, a plugin is activated when installed, meaning it will be loaded and used by Kuzzle on the next restart.

You may want to activate or deactivate a plugin, without uninstalling it.

To deactivate a plugin:

```sh
$ kuzzle plugins --deactivate kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: false,
  config: { port: 7512, room: 'kuzzle', loadedBy: 'server' } }
```

To activate a plugin:

```sh
$ kuzzle plugins --activate kuzzle-plugin-socketio
{ npmVersion: '1.0.7',
  activated: true,
  config: { port: 7512, room: 'kuzzle', loadedBy: 'server' } }
```
