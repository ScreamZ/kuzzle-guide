# Plugins

Plugins are external components triggered on configured events.

There are several types of plugins:

* **Listener plugins** listen to events and are supplied with these events data. Cannot change the provided data, and Kuzzle does not wait for them either
* **Workers plugins** are just like listener plugins, but they are run on a separate process. Useful when performing costly operations as they do not imped Kuzzle performances.
* **Pipe plugins** listen to events, and can validate or modify the provided data. Kuzzle waits for pipe plugins before continuing processing data.
* **Controller plugins** extend Kuzzle API with new controllers and actions.
* **Protocol plugins** extend Kuzzle networking capabilities by adding new network protocols to it
* **Authentication plugins** add new Kuzzle authentication strategies
