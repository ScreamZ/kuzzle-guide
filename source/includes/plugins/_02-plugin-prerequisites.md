## Plugin creation prerequisites

### > Plugin default configuration

All plugins must have a `package.json` file on their root directory, containing a `pluginInfo` entry.

The optional `defaultConfig` attribute is used by Kuzzle to initialize the plugin configuration when installing it.

This configuration can then be changed using the command-line interface.

Default configuration example:

```json
"pluginInfo": {
  "defaultConfig": {
    "any": "information",
    "useful": ["to", "the", "plugin"]
  }
}
```

### > Special plugin configurations

Additionally to plugins' custom configuration, there are a few reserved words used by Kuzzle to configure how a plugin is loaded:

```json
"pluginInfo": {
    "defaultConfig": {
      "loadedBy": "all",
      "threads": 0,
      "privileged": false
    }
  }
```

Where:

| Keyword | Type | Default Value |Description                  |
|---------|------|---------------|-----------------------------|
|`loadedBy`|`string`| `"all"` | Tells Kuzzle to only load the plugin by `"server"`, `"worker"` or `"all"` instances types |
|`threads`|`unsigned integer`|`0`| If > 0, the plugin will be treated as a worker plugin (see below) |
|`privileged`|`boolean`|`false`| If `true`, the plugin is loaded with privileged access to the running Kuzzle instance (see Plugin Context below)<br/>Ignored if `threads` is greater than `0` |

### > Plugin init function

Plugins must expose a ``init`` function. Its purpose is to initialize the plugin according to its configuration.

Kuzzle calls these ``init`` function at startup, during initialization, and ignore any plugin without this function exposed.

Expected arguments:
``function (config, context, isDummy)``

Where:

* ``config`` (JSON Object): JSON object containing the current plugin configuration
* ``context`` (JSON Object): the plugin context (see "Plugin Context" section)
* ``isDummy`` (boolean): when true, the plugin should mock asks the plugin to not really start itself, but instead mock its functionalities (useful when testing plugins, kuzzle, or both)
