## Kuzzle events list

### > event: auth

Events triggered when users perform authentication related actions.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`auth:afterCheckToken`	| `auth` | `checkToken` |Triggered after controller `auth` and action `checkToken`.|Type: Response object|
|`auth:afterLogin`		| `auth` | `login` |Triggered after controller `auth` and action `login`.|Type: Response object|
|`auth:afterLogout`		| `auth` | `logout` |Triggered after controller `auth` and action `logout`.|Type: Response object|
|`auth:afterUpdateSelf`	| `auth` | `updateSelf` |Triggered after controller `auth` and action `updateSelf`.|Type: Response object|
|`auth:beforeCheckToken`| `auth` | `checkToken` |Triggered before controller `auth` and action `checkToken`.|Type: Request object|
|`auth:beforeLogin`		| `auth` | `login` |Triggered before controller `auth` and action `login`.|Type: Object.<br> `{context, requestObject}`|
|`auth:beforeLogout`	| `auth` | `logout` |Triggered before controller `auth` and action `logout`.|Type: Context user.<br> `{profile, role, user, token}`|
|`auth:beforeUpdateSelf`| `auth` | `updateSelf` |Triggered before controller `auth` and action `updateSelf`.|Type: Request object|
|`auth:getCurrentUser`	| `auth` | `getCurrentUser` |Triggered before controller `auth` and action `getCurrentUser`.|Type: Request object|

### > event: cleanDb

Events triggered when a database reset is asked to the command-line interface.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`cleanDb:deleteIndexes`| / | / |Triggered during `cleanDb` process just before indexes deletion. |Type: Request object.<br> Contains all indexes to delete in `requestObject.data.body.indexes`|
|`cleanDb:done`			| / | / |Triggered after indexes deletion.| / |
|`cleanDb:error`		| / | / |Triggered when an error occurred on clean db|Type: Error|

### > event: core

<aside class="warning">Internal use only</aside>

Events triggered to synchronize Kuzzle server instances in a cluster.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`core:kuzzleStart`| / | / | Emitted when Kuzzle is started | / |
|`core:hotelClerk:addSubscription`| / | / | Sends a diff containing the filters and internal hotelClerk updates. | hcR object |
|`core:hotelClerk:join`| / | / | Sends hotelClerk diff when a room is joined. | hcR object |
|`core:hotelClerk:removeRoomForCustomer`| / | / | Sends the room unsubscription information if it changed. | {connection, roomId} |
|`core:indexCache:add`| / | / | Triggered if some data were actually added to Kuzzle's index cache. | {index, collection} |
|`core:indexCache:remove`| / | / | Triggered if some data were actually removed from Kuzzle's index cache. | {index, collection} |
|`core:indexCache:reset`| / |  / | Triggered if the indexCache is resett. | {index} |


### > event: data

Events triggered when users manipulate data (real-time or persisted).

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`data:afterBulkImport`         | `bulk` | `import` |Triggered after controller `bulk` and action `import`.|Type: Response object|
|`data:afterCount`              | `read` | `count` |Triggered after controller `read` and action `count`.|Type: Response object|
|`data:afterCreateCollection`   | `write` | `createCollection` |Triggered after controller `write` and action `createCollection`.|Type: Response object|
|`data:afterCreateIndex`        | `admin` | `createIndex` |Triggered after controller `admin` and action `createIndex`|Type: Response object|
|`data:afterCreate`         	| `write` | `create` |Triggered after controller `write` and action `create`.|Type: Response object|
|`data:afterDeleteByQuery`      | `write` | `deleteByQuery` |Triggered after controller `write` and action `deleteByQuery`.|Type: Response object|
|`data:afterDeleteIndex`        | `admin` | `deleteIndex` |Triggered after controller `admin` and action `deleteIndex`|Type: Response object|
|`data:afterDeleteIndexes`      | `admin` | `deleteIndexes` |Triggered after controller `admin` and action `deleteIndexes`|Type: Response object|
|`data:afterDelete`         	| `write` | `delete` |Triggered after controller `write` and action `delete`.|Type: Response object|
|`data:afterGetAllStats`        | `admin` | `getAllStats` |Triggered after controller `admin` and action `getAllStats`|Type: Response object|
|`data:afterGetLastStats`       | `admin` | `getLastStats` |Triggered after controller `admin` and action `getLastStats`|Type: Response object|
|`data:afterGetMapping`         | `admin` | `getMapping` |Triggered after controller `admin` and action `getMapping`|Type: Response object|
|`data:afterGet`                | `read` | `get` |Triggered after controller `read` and action `get`.|Type: Response object|
|`data:afterGetStats`           | `admin` | `getStats` |Triggered after controller `admin` and action `getStats`|Type: Response object|
|`data:afterListCollections`    | `read` | `listCollections` |Triggered after controller `read` and action `listCollections`.|Type: Response object|
|`data:afterListIndexes`        | `read` | `listIndexes` |Triggered after controller `read` and action `listIndexes`.|Type: Response object|
|`data:afterNow`                | `read` | `now` |Triggered after controller `read` and action `now`.|Type: Response object|
|`data:afterPublish`         	| `write` | `createOrReplace` |Triggered after controller `write` and action `createOrReplace`.|Type: Response object|
|`data:afterPublish`         	| `write` | `createOrReplace` |Triggered after controller `write` and action `createOrReplace`.|Type: Response object|
|`data:afterPublish`         	| `write` | `publish` |Triggered after controller `write` and action `publish`.|Type: Response object|
|`data:afterRefreshIndex`       | `admin` | `refreshIndex` |Triggered after controller `admin` and action `refreshIndex`.|Type: Response object|
|`data:afterReplace`         	| `write` | `replace` |Triggered after controller `write` and action `replace`.|Type: Response object|
|`data:afterSearch`             | `read` | `search` |Triggered after controller `read` and action `search`.|Type: Response object|
|`data:afterServerInfo`         | `read` | `serverInfo` |Triggered after controller `read` and action `serverInfo`.|Type: Response object|
|`data:afterTruncateCollection` | `admin` | `truncateCollection` |Triggered after controller `admin` and action `truncateCollection`|Type: Response object|
|`data:afterUpdateMapping`      | `admin` | `updateMapping` |Triggered after controller `admin` and action `updateMapping`|Type: Response object|
|`data:afterUpdate`         	| `write` | `update` |Triggered after controller `write` and action `update`.|Type: Response object|
|`data:beforeBulkImport`        | `bulk` | `import` |Triggered before controller `bulk` and action `import`.|Type: Response object|
|`data:beforeCount`             | `read` | `count` |Triggered before controller `read` and action `count`.|Type: Request object|
|`data:beforeCreateCollection`  | `write` | `createCollection` |Triggered before controller `write` and action `createCollection`.|Type: Request object|
|`data:beforeCreateIndex`       | `admin` | `createIndex` |Triggered before controller `admin` and action `createIndex`|Type: Request object|
|`data:beforeCreateOrReplace`   | `write` | `createOrReplace` |Triggered before controller `write` and action `createOrReplace`.|Type: Request object|
|`data:beforeCreateOrReplace`   | `write` | `createOrReplace` |Triggered before controller `write` and action `createOrReplace`.|Type: Request object|
|`data:beforeCreate`        	| `write` | `create` |Triggered before controller `write` and action `create`.|Type: Request object|
|`data:beforeCreate`        	| `write` | `create` |Triggered before controller `write` and action `create`.|Type: Request object|
|`data:beforeDeleteByQuery`   	| `write` | `deleteByQuery` |Triggered before controller `write` and action `deleteByQuery`.|Type: Request object|
|`data:beforeDeleteIndex`       | `admin` | `deleteIndex` |Triggered before controller `admin` and action `deleteIndex`|Type: Request object|
|`data:beforeDeleteIndexes`     | `admin` | `deleteIndexes` |Triggered before controller `admin` and action `deleteIndexes`|Type: Request object|
|`data:beforeDelete`   			| `write` | `delete` |Triggered before controller `write` and action `delete`.|Type: Request object|
|`data:beforeGetAllStats`       | `admin` | `getAllStats` |Triggered before controller `admin` and action `getAllStats`|Type: Request object|
|`data:beforeGetLastStats`      | `admin` | `getLastStats` |Triggered before controller `admin` and action `getLastStats`|Type: Request object|
|`data:beforeGetMapping`        | `admin` | `getMapping` |Triggered before controller `admin` and action `getMapping`|Type: Request object|
|`data:beforeGet`               | `read` | `get` |Triggered before controller `read` and action `get`.|Type: Request object|
|`data:beforeGetStats`          | `admin` | `getStats` |Triggered before controller `admin` and action `getStats`|Type: Request object|
|`data:beforeListCollections`   | `read` | `listCollections` |Triggered before controller `read` and action `listCollections`.|Type: Request object|
|`data:beforeListIndexes`       | `read` | `listIndexes` |Triggered before controller `read` and action `listIndexes`.|Type: Request object|
|`data:beforeNow`               | `read` | `now` |Triggered before controller `read` and action `now`.|Type: Request object|
|`data:beforePublish`        	| `write` | `publish` |Triggered before controller `write` and action `publish`.|Type: Request object|
|`data:beforeRefreshIndex`      | `admin` | `refreshIndex` |Triggered before controller `admin` and action `refreshIndex`.|Type: Request object|
|`data:beforeReplace`   		| `write` | `replace` |Triggered before controller `write` and action `replace`.|Type: Request object|
|`data:beforeSearch`            | `read` | `search` |Triggered before controller `read` and action `search`.|Type: Request object|
|`data:beforeTruncateCollection`| `admin` | `truncateCollection` |Triggered before controller `admin` and action `truncateCollection`|Type: Request object|
|`data:beforeUpdateMapping`     | `admin` | `updateMapping` |Triggered before controller `admin` and action `updateMapping`|Type: Request object|
|`data:beforeUpdate`   			| `write` | `update` |Triggered before controller `write` and action `update`.|Type: Request object|

### > event: internalBroker

<aside class="warning">Internal use only</aside>

Events triggered by the Kuzzle internal message broker, used to transmit data between Kuzzle instances.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`internalBroker:connected`		| / | / |Triggered when the internal broker is connected|Type: String.<br> `'Connected to Kuzzle server'`|
|`internalBroker:error`			| / | / |Triggered when an error occured in internal broker|Type: Object.<br> {host, port, message, retry}|
|`internalBroker:reregistering`	| / | / |Triggered when the internal broker is reregistered|Type: String.<br> `'Re-registering room: ' + room`|
|`internalBroker:socketClosed`	| / | / |Triggered when the socket is closed|Type: String|
|`internalBroker:started`		| / | / |Triggered when the internal broker is started|Type: String.<br> `'Internal broker server started'`|

### > event: memoryStorage

Events triggered when users manipulate data using Kuzzle memory storage capabilities.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`memoryStorage:after<Action>`	| `memoryStorage` | / |All actions in `memoryStorage` controller have a trigger after |Type: Response object|
|`memoryStorage:before<Action>`	| `memoryStorage` | / |All actions in `memoryStorage` controller have a trigger before |Type: Request object|

### > event: prepareDb

Events triggered during Kuzzle startup, when the database is prepared for Kuzzle's use.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`prepareDb:createFixturesIndex`	| / | / |Triggered during database preparation. Called for each index in fixtures|Type: Request object.<br> Contains the index to create in `requestObject.index`|
|`prepareDb:createInternalIndex`	| / | / |Triggered on Kuzzle start for creating the internal index `%kuzzle`|Type: Request object.<br> Contains the internal index in `requestObject.index`|
|`prepareDb:error`					| / | / |Triggered when an error occurred during database preparation|Type: Error|
|`prepareDb:importFixtures`			| / | / |Triggered during database preparation. Called for each fixtures to import|Type: Request object.<br> Contains the index in `requestObject.index` and bulk in `requestObject.data.body`|
|`prepareDb:importMapping`			| / | / |Triggered during database preparation. Called for each mapping to import|Type: Request object.<br> Contains the index in `requestObject.index` and mapping in `requestObject.data.body`|
|`prepareDb:updateMappingProfiles`	| / | / |Triggered on Kuzzle start for creating the internal mapping for Profiles collection|Type: Request object.<br> Contains the default mapping in `requestObject.data.body`|
|`prepareDb:updateMappingRoles`		| / | / |Triggered on Kuzzle start for creating the internal mapping for Roles collection|Type: Request object.<br> Contains the default mapping in `requestObject.data.body`|
|`prepareDb:updateMappingUsers`		| / | / |Triggered on Kuzzle start for creating the internal mapping for Users collection|Type: Request object.<br> Contains the default mapping in `requestObject.data.body`|

### > event: protocol

Events triggered to interact with `protocol` plugins.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`protocol:broadcast`		| / | / |Triggered before broadcast. You can't modify the input on this event.|Type: Object.<br>  `{payload, channel}` <br>`payload` is the notification content. <br>`channel` is the channel name.|
|`protocol:joinChannel`		| / | / |Triggered after attach a user to a room. You can't modify the input on this event.|Type: Object.<br>  `{channel, id}` <br>`channel` is the channel name.<br> `id` is the connection id|
|`protocol:leaveChannel`	| / | / |Triggered before a room is removed for the user. You can't modify the input on this event.|Type: Object.<br>  `{channel, id}` <br>`channel` is the channel name.<br> `id` is the connection id|
|`protocol:notify`			| / | / |Triggered before notify a connection id.|Type: Object.<br>  `{payload, channel, id}` <br>`payload` is the notification content. <br>`channel` is the channel name.<br> `id` is the connection id|

### > event: rabbit

<aside class="warning">Deprecated</aside>

Events triggered to report RabbitMQ activity.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`rabbit:error`			| / | / |Triggered when an error occured on rabbit connection|Type: Error|
|`rabbit:started`		| / | / |Triggered when rabbit MQ service is started|Type: String.<br> `'RabbitMQ Service started'`|
|`rabbit:stopped`		| / | / |Triggered when the rabbit MQ service is stopped|Type: String.<br> `'RabbitMQ Service stopped'`|

### > event: room

Events triggered on subscription rooms activity.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`room:new`					| / | / |Triggered when a new room is added in the rooms list. You can't modify the input on this event.|Type: Object. <br> `{roomId, index, collection, formattedFilters}`|
|`room:remove`				| / | / |Triggered after a room is removed from the list. You can't modify the input on this event.|Type: String.<br> The room id|

### > event: security

Events triggered when users perform security related actions.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`security:afterCreateOrReplaceProfile`	| `security` | `createOrReplaceProfile` |Triggered after controller `security` and action `createOrReplaceProfile`.|Type: Response object|
|`security:afterCreateOrReplaceRole`	| `security` | `createOrReplaceRole` |Triggered after controller `security` and action `createOrReplaceRole`.|Type: Response object|
|`security:afterCreateOrReplaceUser`	| `security` | `createOrReplaceUser` |Triggered after controller `security` and action `createOrReplaceUser`.|Type: Response object|
|`security:afterCreateProfile`			| `security` | `createProfile` |Triggered after controller `security` and action `createProfile`.|Type: Response object|
|`security:afterCreateRole`				| `security` | `createRole` |Triggered after controller `security` and action `createRole`.|Type: Response object|
|`security:afterCreateUser`				| `security` | `createUser` |Triggered after controller `security` and action `createUser`.|Type: Response object|
|`security:afterDeleteProfile`			| `security` | `deleteProfile` |Triggered after controller `security` and action `deleteProfile`.|Type: Response object|
|`security:afterDeleteRole`				| `security` | `deleteRole` |Triggered after controller `security` and action `deleteRole`.|Type: Response object|
|`security:afterDeleteUser`				| `security` | `deleteUser` |Triggered after controller `security` and action `deleteUser`.|Type: Response object|
|`security:afterGetProfile`				| `security` | `getProfile` |Triggered after controller `security` and action `getProfile`.|Type: Response object|
|`security:afterGetRole`				| `security` | `getRole` |Triggered after controller `security` and action `getRole`.|Type: Response object|
|`security:afterGetUser`				| `security` | `getUser` |Triggered after controller `security` and action `getUser`.|Type: Response object|
|`security:afterMGetProfiles`			| `security` | `mGetProfiles` |Triggered after controller `security` and action `mGetProfiles`.|Type: Response object|
|`security:afterMGetRoles`				| `security` | `mGetRoles` |Triggered after controller `security` and action `mGetRoles`.|Type: Response object|
|`security:afterSearchProfiles`			| `security` | `searchProfiles` |Triggered after controller `security` and action `searchProfiles`.|Type: Response object|
|`security:afterSearchRole`				| `security` | `searchRoles` |Triggered after controller `security` and action `searchRoles`.|Type: Response object|
|`security:afterSearchUsers`			| `security` | `searchUsers` |Triggered after controller `security` and action `searchUsers`.|Type: Response object|
|`security:afterUpdateProfile`			| `security` | `updateProfile` |Triggered after controller `security` and action `updateProfile`.|Type: Response object|
|`security:afterUpdateRole`				| `security` | `updateRole` |Triggered after controller `security` and action `updateRole`.|Type: Response object|
|`security:afterUpdateUser`				| `security` | `updateUser` |Triggered after controller `security` and action `updateUser`.|Type: Response object|
|`security:beforeCreateOrReplaceProfile`| `security` | `createOrReplaceProfile` |Triggered before controller `security` and action `createOrReplaceProfile`.|Type: Object.<br> `{context, requestObject}`|
|`security:beforeCreateOrReplaceRole`	| `security` | `createOrReplaceRole` |Triggered before controller `security` and action `createOrReplaceRole`.|Type: Object.<br> `{context, requestObject}`|
|`security:beforeCreateOrReplaceUser`	| `security` | `createOrReplaceUser` |Triggered before controller `security` and action `createOrReplaceUser`.|Type: Request object|
|`security:beforeCreateProfile`			| `security` | `createProfile` |Triggered before controller `security` and action `createProfile`.|Type: Object.<br> `{context, requestObject}`|
|`security:beforeCreateRole`			| `security` | `createRole` |Triggered before controller `security` and action `createRole`.|Type: Object.<br> `{context, requestObject}`|
|`security:beforeCreateUser`			| `security` | `createUser` |Triggered before controller `security` and action `createUser`.|Type: Request object|
|`security:beforeDeleteProfile`			| `security` | `deleteProfile` |Triggered before controller `security` and action `deleteProfile`.|Type: Request object|
|`security:beforeDeleteRole`			| `security` | `deleteRole` |Triggered before controller `security` and action `deleteRole`.|Type: Request object|
|`security:beforeDeleteUser`			| `security` | `deleteUser` |Triggered before controller `security` and action `deleteUser`.|Type: Request object|
|`security:beforeGetProfile`			| `security` | `getProfile` |Triggered before controller `security` and action `getProfile`.|Type: Request object|
|`security:beforeGetRole`				| `security` | `getRole` |Triggered before controller `security` and action `getRole`.|Type: Request object|
|`security:beforeGetUser`				| `security` | `getUser` |Triggered before controller `security` and action `getUser`.|Type: Request object|
|`security:beforeMGetProfiles`			| `security` | `mGetProfiles` |Triggered before controller `security` and action `mGetProfiles`.|Type: Request object|
|`security:beforeMGetRoles`				| `security` | `mGetRoles` |Triggered before controller `security` and action `mGetRoles`.|Type: Request object|
|`security:beforeSearchProfiles`		| `security` | `searchProfiles` |Triggered before controller `security` and action `searchProfiles`.|Type: Request object|
|`security:beforeSearchRole`			| `security` | `searchRoles` |Triggered before controller `security` and action `searchRoles`.|Type: Request object|
|`security:beforeSearchUsers`			| `security` | `searchUsers` |Triggered before controller `security` and action `searchUsers`.|Type: Request object|
|`security:beforeUpdateProfile`			| `security` | `updateProfile` |Triggered before controller `security` and action `updateProfile`.|Type: Object.<br> `{context, requestObject}`|
|`security:beforeUpdateRole`			| `security` | `updateRole` |Triggered before controller `security` and action `updateRole`.|Type: Object.<br> `{context, requestObject}`|
|`security:beforeUpdateUser`			| `security` | `updateUser` |Triggered before controller `security` and action `updateUser`.|Type: Request object|
|`security:formatUserForSerialization`	| / | / |Triggered before serialize a user. Useful to clean a user like attribute `password`|Type: User|

### > event: server

Events triggered to report general Kuzzle server activity.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`server:httpStarted`		| / | / |Triggered when the http server is started.|Type: String|
|`server:mqStarted`			| / | / |Triggered when the MQ server is started.|Type: String|
|`server:overload`			| / | / |Triggered when the server overload|Type: String.<br> Contains the overload percentage with '%' character|

### > event: subscription

Events triggered when users perform subscription related actions.

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`subscription:afterCount`	| `subscribe` | `count` |Triggered after controller `subscribe` and action `count`.|Type: Response object|
|`subscription:afterJoin`	| `subscribe` | `join` |Triggered after controller `subscribe` and action `join`.|Type: Response object|
|`subscription:afterList`	| `subscribe` | `list` |Triggered after controller `subscribe` and action `list`.|Type: Response object|
|`subscription:afterOff`	| `subscribe` | `off` |Triggered after controller `subscribe` and action `off`.|Type: Response object|
|`subscription:afterOn`		| `subscribe` | `on` |Triggered after controller `subscribe` and action `on`.|Type: Response object|
|`subscription:afterRemoveRooms`	| `admin` | `removeRooms` |Triggered after controller `admin` and action `removeRooms`. When the remove is done|Type: Response object|
|`subscription:beforeCount`	| `subscribe` | `count` |Triggered before controller `subscribe` and action `count`.|Type: Request object|
|`subscription:beforeJoin`	| `subscribe` | `join` |Triggered before controller `subscribe` and action `join`.|Type: Request object|
|`subscription:beforeList`	| `subscribe` | `list` |Triggered before controller `subscribe` and action `list`.|Type: Request object|
|`subscription:beforeOff`	| `subscribe` | `off` |Triggered before controller `subscribe` and action `off`.|Type: Request object|
|`subscription:beforeOn`	| `subscribe` | `on` |Triggered before controller `subscribe` and action `on`.|Type: Request object|
|`subscription:beforeRemoveRooms`	| `admin` | `removeRooms` |Triggered before controller `admin` and action `removeRooms`. This action remove all rooms for a given collection|Type: Request object|


### > event: workerGroup

<aside class="warning">Internal use only</aside>

| Event | Controller| Action | Description | Input |
|-------|-----------|--------|-------------|-------|
|`workerGroup:loaded`	| / | / |Triggered when workers are loaded|Type: String.<br> Worker group name|
