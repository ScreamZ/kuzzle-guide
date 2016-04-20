## Architecture

![archi_fonctionnal](./images/global-overview.png)

Kuzzle Kernel API can be accessed from 3 different paths:

1. a [RESTFul API](/api-reference/?rest)
2. a [Websocket connexion](/api-reference/?websocket), using Kuzzle [Javascript SDK](/sdk-documentation)
3. or any other custom protocol, using a Protocol Plugin (examples: [AMQP](/api-reference/?amqp), [MQTT](/api-reference/?mqtt), [STOMP](/api-reference/?stomp))

In the background, Kuzzle uses:

* a noSQL engine to store, index and search contents (we use Elasticsearch by default).
* a cache engine to store subscription lists (we use redis by default).

### Core architecture

Focus on the above "Kuzzle kernel":

![archi_core](./images/core-architecture.png)

#### Main core components

* **Router Controller**: implements the 3 API routers, normalizes the input message and sends them to the Funnel Controller
* **Funnel Controller**: analyses the input message and calls the appropriate controller (see [API specification](api-specifications.md))
* **Admin Controller**, **Auth Controller**, **Bulk Controller**, **Write Controller**, **Subscribe Controller**, **Read Controller**: handles the input message (see [API reference](/api-reference))
* **Internal Components**: Any component used internally by controllers and any other internal component to interact with services


#### Hooks

Hooks allow to attach actions to Kuzzle events.

For example, Admin, Bulk and Writer controllers emit a "data:create" event to handle some writing actions through the storage engine.
This event will trigger the execution of the *add* method and of the *write* hook, which will send the received message to the internal broker.

Then it is possible to implement custom hooks to trigger any event emitted by Kuzzle.

The list of available events and their default attached actions can be found in the [config/hooks.js](https://github.com/kuzzleio/kuzzle/blob/master/lib/config/hooks.js) file.

As an example, when the "data:afterCreate" event is emitted by kuzzle, it will trigger the execution of the *add* method of the *write* hook, which will send the received message to the broker.

##### Contributing

You can define and add your own custom hooks.

A hook must be a valid node.js module that implements an init() function.

The init function is passed to the current kuzzle instance object.

Your module must be placed in the /lib/hooks directory.

You can then attach your hook to some events by editing the [config/hooks.js](https://github.com/kuzzleio/kuzzle/blob/master/lib/config/hooks.js) configuration file.

#### Services

In Kuzzle, a Service module is the implementation of the interface to external services used by the application (internal broker, storage engine, cache engine, etc.)

_For more details, see [services description](../lib/services/README.md)_

#### Workers

A worker is an independant component, detachable from a Kuzzle server container. It can be run in another container or even on another machine.

Workers attach themselves to the internal broker service fed by Kuzzle to perform any kind of task.

For instance, writing persistent data on Kuzzle is implemented as a write worker.

Additionally, serveral Workers of the same type can be launched in parallel, on the same or on a different host.

This flexibility allows administrators of Kuzzle system to leverage their resource consumption and distribute and/or scale their services to better fit their needs.


_For more details, see [workers description](../lib/workers/README.md)_

### Next steps

See [Request Scenarios documentation](request_scenarios/README.md) to see how these components are used together to handle a client's action.
