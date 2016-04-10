# ~ security controller

## createOrReplaceProfile

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/profiles/<profile_id>`  
>**Method:** `PUT`  
>**Body**  

<section class="rest"></section>
```litcoffee
{
  body: {
    roles: ['<roleID>', '<roleID>', ...] // The new array of role IDs (cannot be empty)
  }
}
```

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "createOrReplaceProfile",

  _id: "<the role id>",
  // the role definition
  body: {
    roles: ['<roleID>', '<roleID>', ...]
  }
}
```

> Response

```litcoffee
{
  status:200,                       // Assuming everything went well
  error: null,                      // Assuming everything wen well
  result: {
    _id: "<profile_id>",
    _index: "%kuzzle",
    _type: "profiles",
    _version: 1,
    created: false,
  },
  requestId: "<unique request identifier>",
  controller: "security",
  action: "createOrReplaceProfile",
  metadata: {},
  state: "done"
}
```

Creates (if no `_id` provided) or updates (if `_id` matches an existing one) a profile with a new list of roles.

## createOrReplaceRole

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/roles/<role id>` or `http://kuzzle:7511/api/1.0/roles/<role id>/_createOrReplace`
>**Method:** `PUT`  
>**Body**

<section class="rest"></section>
```litcoffee
{
  body: {
    indexes: {
      "_canCreate": true,
      "*": {
        "_canDelete": true,
        collections: {
          "_canCreate": true,
          "*": {
            "_canDelete": true,
            controllers: {
              "*": {
                actions: {
                  "*": true
                }
              }
            }
          }
        }
      }
    }
  }
}
```

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "createOrReplaceRole",

  _id: "<the role id>",
  // the role definition
  body: {
    indexes: {
      "_canCreate": true,
      "*": {
        "_canDelete": true,
        collections: {
          "_canCreate": true,
          "*": {
            "_canDelete": true,
            controllers: {
              "*": {
                actions: {
                  "*": true
                }
              }
            }
          }
        }
      }
    }
  }
}
```

>Response

```litcoffee
{
  status:200,                       // Assuming everything went well
  error":null,                      // Assuming everything wen well
  result: {
    _id: "<role id>",
    _index: "%kuzzle",
    _type: "roles",
    _version: 1,
    created: true,
    _source: {} // your role definition
  }
  requestId: "<unique request identifier>",
  controller: "security",
  action: "createOrReplaceRole",
  metadata: {},
  state: "done"
}
```

Validates and stores a role in Kuzzle's persistent data storage.

The body content needs to match Kuzzle's role definition.  
To get some more detailed information on the expected role definition, please refer to [Kuzzle's role reference definition documentation](https://github.com/kuzzleio/kuzzle/blob/master/docs/security/roles-reference.md).

To get some more detailed information about Kuzzle's user management model, please refer to [Kuzzle's security documentation](https://github.com/kuzzleio/kuzzle/blob/master/docs/security/).

## createOrReplaceUser

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/users/<user id>`  
>**Method:** `PUT`  
>**Body**  

<section class="rest"></section>
```litcoffee
{
  profile: "<profile id>",              // mandatory. The profile id for the user
  name: "John Doe",                     // Additional optional User properties
  ...
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "createOrReplaceUser",

  _id: "<the user id>",
  body: {
    profile: "<profile id>",            // mandatory. The profile id for the user
    name: "John Doe",                   // Additional optional User properties
    ...
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "%kuzzle",
  collection: "users",
  controller: "write",
  action: "createOrReplace",
  metadata: {},
  scope: null,
  state: "done",
  requestId: "<unique request identifier>",    
  result: {
    _id: "<user id, either provided or auto-generated>",
    _index: "%kuzzle",
    _source: {
      profile: "<profile id>",
      name: "John Doe",
      ...
    },
    _type: "users",
    _version: 1,
    created: true
  }
}
```

Persist a `user` object to Kuzzle's database layer.

The `user` is created if it does not exists yet or replaced with the given object if it does.

## createProfile

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/profiles/_create`  
>**Method:** `POST`  
>**Body**  

<section class="rest"></section>
```litcoffee
{
  _id: "<profile ID>",
  body: {
    roles: ['<roleID>', '<roleID>', ...] // The new array of role IDs (cannot be empty)
  }
}
```

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "createProfile",

  _id: "<the role id>",
  // the role definition
  body: {
    roles: ['<roleID>', '<roleID>', ...]
  }
}
```

> Response

```litcoffee
{
  status:200,                       // Assuming everything went well
  error: null,                      // Assuming everything wen well
  result: {
    _id: "<profile_id>",
    _index: "%kuzzle",
    _type: "profiles",
    _version: 1,
    created: true,
    _source: {} // your profile definition
  },
  requestId: "<unique request identifier>",
  controller: "write",
  action: "create",
  metadata: {},
  state: "done"
}
```

Creates a profile with a new list of roles.

**Note:** The `_id` parameter is mandatory.


## createRole

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/roles/_create`  
>**Method:** `POST`  
>**Body**

<section class="rest"></section>
```litcoffee
{
  _id: "<the role id>",
  body: {
    indexes: {
      "_canCreate": true,
      "*": {
        "_canDelete": true,
        collections: {
          "_canCreate": true,
          "*": {
            "_canDelete": true,
            controllers: {
              "*": {
                actions: {
                  "*": true
                }
              }
            }
          }
        }
      }
    }
  }
}
```

<section class="amqp stomp"></section>
>**replyTo** header is optional.

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "createRole",

  _id: "<the role id>",
  // the role definition
  body: {
    indexes: {
      "_canCreate": true,
      "*": {
        "_canDelete": true,
        collections: {
          "_canCreate": true,
          "*": {
            "_canDelete": true,
            controllers: {
              "*": {
                actions: {
                  "*": true
                }
              }
            }
          }
        }
      }
    }
  }
}
```

>Response

```litcoffee
{
  status:200,                       // Assuming everything went well
  error":null,                      // Assuming everything wen well
  result: {
    _id: "<role id>",
    _index: "%kuzzle",
    _type: "roles",
    _version: 1,
    created: true,
    _source: {} // your role definition
  }
  requestId: "<unique request identifier>",
  controller: "write",
  action: "create",
  metadata: {},
  state: "done"
}
```

Validates and stores a role in Kuzzle's persistent data storage.  
**Note:** The `_id` parameter is mandatory.

The body content needs to match Kuzzle's role definition.  
To get some more detailed information on the expected role definition, please refer to [Kuzzle's role reference definition documentation](https://github.com/kuzzleio/kuzzle/blob/master/docs/security/roles-reference.md).

To get some more detailed information about Kuzzle's user management model, please refer to [Kuzzle's security documentation](https://github.com/kuzzleio/kuzzle/blob/master/docs/security/).

## createUser

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/users/_create`  
>**Method:** `POST`  
>**Body**

<section class="amqt stomp"></section>
>**replyTo** header is optional.

<section class="rest"></section>
```litcoffee
{
  _id: "<the user id>",                 // Optional. If not provided, will be generated automatically.
  profile: "<profile id>",              // Mandatory. The profile id for the user
  name: "John Doe",                     // Additional optional User properties
  ...
}

// example with a "local" authentication

{
  _id: "<the user id>",                 // Optional. If not provided, will be generated automatically.
  profile: "<profile id>",              // Mandatory. The profile id for the user
  name: "John Doe",                     // Additional optional User properties
  ...
  password: "MyPassword"                // ie: Mandatory for "local" authentication plugin
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "createUser",

  _id: "<the user id>",                 // Optional. If not provided, will be generated automatically.
  body: {
    profile: "<profile id>",            // Mandatory. The profile id for the user
    name: "John Doe",                   // Additional optional User properties
    ...
  }
}

// example with a "local" authentication

{
  controller: "security",
  action: "createUser",

  _id: "<the user id>",                 // Optional. If not provided, will be generated automatically.
  body: {
    profile: "<profile id>",            // Mandatory. The profile id for the user
    name: "John Doe",                   // Additional optional User properties
    ...
    password: "MyPassword"              // ie: Mandatory for "local" authentication plugin
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "%kuzzle",
  collection: "users",
  controller: "write",
  action: "create",
  metadata: {},
  scope: null,
  state: "done",
  requestId: "<unique request identifier>",    
  result: {
    _id: "<user id, either provided or auto-generated>",
    _index: "%kuzzle",
    _source: {
      profile: "<profile id>",
      name: "John Doe",
      ...
    },
    _type: "users",
    _version: 1,
    created: true
  }
}
```

Creates a new `user` in Kuzzle's database layer.

If an `_id` is provided in the query and if a `user` already exists with the given `_id`, an error is returned.

Other mandatory additional informations are needed depending on the authentication plugins installed you want to use.

## deleteProfile

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_profiles/<profile_id>`  
>**Method:** `DELETE`  

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "deleteProfile",

  // The profile unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a profile.
  _id: "<profile ID>"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "deleteProfile",


  // The profile unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a profile.
  _id: "<profile ID>"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "deleteProfile",

  // The profile unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a profile.
  _id: "<profile ID>"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  result: {
    _id: "<Profile ID>",        // The profile ID
  },
  index: "%kuzzle",
  collection: "profiles",
  action: "deleteProfile",
  controller: "security",
  requestId: "<unique request identifier>"
}
```

Given a `profile id`, deletes the corresponding profile from the database. Note
that the related roles will NOT be deleted.

## deleteRole

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/roles/<role id>`  
>**Method:** `DELETE`  

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "deleteRole",

  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<role ID>"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "deleteRole",


  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<role ID>"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "deleteRole",

  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<role ID>"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  result: {
    _id: "<Unique role ID>"         // The role ID
  }
  index: "%kuzzle",
  collection: "roles"
  action: "deleteRole",
  controller: "security",
  requestId: "<unique request identifier>"
}
```

Given a `role id`, delete the corresponding role from the database.

## deleteUser

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/users/<user id>`  
>**Method:** `DELETE`  

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "deleteUser",

  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<role ID>"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "deleteUser",


  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<user ID>"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "deleteUser",

  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<user ID>"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  result: {
    _id: "<Unique role ID>"         // The role ID
  }
  index: "%kuzzle",
  collection: "users",
  action: "deleteUser",
  controller: "security",
  requestId: "<unique request identifier>"
}
```

Given a `user id`, deletes the corresponding `user` from Kuzzle's database layer.

## getProfile

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/_profiles/<profile_id>`  
>**Method:** `GET`

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "getProfile",

  // The profile unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a profile.
  _id: "<profile ID>"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "getProfile",


  // The profile unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a profile.
  _id: "<profile ID>"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "getProfile",

  // The profile unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a profile.
  _id: "<profile ID>"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  result: {
    _id: "<Unique profile ID>",        // The profile ID
    _source: {                      // The requested profile
      ...
    },
    index: "%kuzzle",
    collection: "profiles"
    action: "getProfile",
    controller: "security",
    requestId: "<unique request identifier>"
  }
}
```
Given a `profile id`, retrieve the corresponding profile from the database.

## getRole

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/roles/<role id>`  
>**Method:** `GET`  

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "getRole",

  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<role ID>"
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "getRole",


  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<role ID>"
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "getRole",

  // The role unique identifier. It's the same one that Kuzzle sends you
  // in its responses when you create a role.
  _id: "<role ID>"
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  result: {
    _id: "<Unique role ID>",        // The role ID
    _source: {
      indexes: {
        ...
      }
    }
  },
  index: "%kuzzle",
  collection: "roles"
  action: "getRole",
  controller: "security",
  metadata: {},
  requestId: "<unique request identifier>"
}
```

Given a `role id`, retrieves the corresponding role from the database.

## getUser

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/users/<user id>`  
>**Method:** `GET`

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "getUser",
  _id: "<user id>"  
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "getUser",
  _id: "<user id>"  
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "getUser",
  _id: "<user id>"  
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "<data index>",
  collection: "<data collection>",
  controller: "security",
  action: "getUser",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id:"<user id>",
    _source: {
      name: {
        first: "Steve",
        last: "Wozniak"
        },
        ...                         // The user object content
        profile: {
          _id:"<profile id>",
          roles: [
            ...                     // Users roles definitions
          ]
        }
    }
  }
}
```


Given a `user id`, gets the matching user from Kuzzle's dabatase layer.

## mGetProfiles

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/profiles/_mget`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  body: {
    // ids must be an array of profile ids
    ids: ["myFirstProfile", "MySecondProfile"],
    // if hydrate is true, the object is returned as Profile object (with an array of Role object) instead of plain elasticsearch document
    hydrate: false
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "mGetProfiles",
  body: {
    // ids must be an array of profile ids
    ids: ["myFirstProfile", "MySecondProfile"],
    // if hydrate is true, the object is returned as Profile object (with an array of Role object) instead of plain elasticsearch document
    hydrate: false
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "mGetProfiles",
  body: {
    // ids must be an array of profile ids
    ids: ["myFirstProfile", "MySecondProfile"],
    // if hydrate is true, the object is returned as Profile object (with an array of Role object) instead of plain elasticsearch document
    hydrate: false
  }  
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "mGetProfiles",
  body: {
    // ids must be an array of profile ids
    ids: ["myFirstProfile", "MySecondProfile"],
    // if hydrate is true, the object is returned as Profile object (with an array of Role object) instead of plain elasticsearch document
    hydrate: false
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "%kuzzle",
  collection: "profiles"
  action: "mGetProfiles",
  controller: "security",
  requestId: "<unique request identifier>",
  result: {
    _source: {
      ...
    }
  }
}
```

Retrieves a list of `profile` objects from Kuzzle's database layer given a list of profile ids.

## mGetRoles

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/roles/_mget`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  body: {
    // ids must be an array of role id
    ids: ["myFirstRole", "MySecondRole"]
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "mGetRoles",
  body: {
    // ids must be an array of role id
    ids: ["myFirstRole", "MySecondRole"]
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "mGetRoles",
  body: {
    // ids must be an array of role id
    ids: ["myFirstRole", "MySecondRole"]
  }  
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "mGetRoles",
  body: {
    // ids must be an array of role id
    ids: ["myFirstRole", "MySecondRole"]
  }
}
```

>Response

```litcoffee
{
  action: "mGetRoles",
  collection: "roles",
  controller: "read",
  error: null,
  index: "%kuzzle",
  metadata: {},
  requestId: "<unique request identifier>",
  result:
  {
     _shards: {
       failed: 0,
       successful: 5,
       total: 5
     },
     hits: [
       {
         _id: 'test',
         _index: '%kuzzle',
         _score: 1,
         _source: {
           _id: 'test',
           indexes: {} // Rights for each indexes, controllers, ... can be found here
         },
         _type: 'roles'
       }
     ],
     max_score: null,
     timed_out: false,
     took: 1,
     total: 1
  },
  scope: null,
  state: 'done',
  status: 200
}
```

Retrieves a list of `role` objects from Kuzzle's database layer given a list of role ids.

## searchProfiles

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/profiles/_search`  
>**Method:** `POST`  
>**Body**

<section class="rest"></section>
```litcoffee
{
  body: {
    // if hydrate is true, the object is returned as Profile object (with an array of Role object) instead of plain elasticsearch document
    hydrate: false,
    // filter can contains an array `roles` with a list of role id
   roles:  ['myrole', 'admin'],
   // filter can handler pagination with properties `from` and `size`
   from: 0,
   size: 10
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "searchProfiles",
  body: {
    // if hydrate is true, the object is returned as Profile object (with real Role object) instead of plain elasticsearch document
    hydrate: false,
    // filter can contains an array `roles` with a list of role id
   roles:  ['myrole', 'admin'],
   // filter can handler pagination with properties `from` and `size`
   from: 0,
   size: 10
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "searchProfiles",
  body: {
    // if hydrate is true, the object is returned as Profile object (with real Role object) instead of plain elasticsearch document
    hydrate: false,
    // filter can contains an array `roles` with a list of role id
   roles:  ['myrole', 'admin'],
   // filter can handler pagination with properties `from` and `size`
   from: 0,
   size: 10
  }
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "searchProfiles",
  body: {
    // if hydrate is true, the object is returned as Profile object (with real Role object) instead of plain elasticsearch document
    hydrate: false,
    // filter can contains an array `roles` with a list of role id
   roles:  ['myrole', 'admin'],
   // filter can handler pagination with properties `from` and `size`
   from: 0,
   size: 10
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  result:
  {
    "_shards": {
      "failed": 0,
      "successful": 5,
      "total": 5
    },
    "hits": [
      {
        "_id": "my-profile-1",
        "_source": {
          "roles": [
            "myrole"
          ]
        }
      },
      {
        "_id": "my-profile-2",
        "_source": {
          "roles": [
            "myrole"
          ]
        }
      }
    ],
    "max_score": 1,
    "timed_out": false,
    "took": 1,
    "total": 2
    },
    index: "%kuzzle",
    collection: "profiles"
    action: "searchProfiles",
    controller: "security",
    requestId: "<unique request identifier>"
  }
}
```

Retrieves all the profiles that contain a given set of roles.  
Attribute `roles` in body is optional.  
Set `hydrate` to `true` if you want the returned profiles to be populated with
a set of `Role` objects instead of an array of ids.

Available filters:

| Filter | Type | Description | Default |
|---------------|---------|----------------------------------------|---------|
| ``roles`` | array | Contains an array `roles` with a list of role id | ``undefined`` |
| ``from`` | number | Starting offset | ``0`` |
| ``to`` | number |  Number of hits to return | ``20`` |

## searchRoles

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/roles/_search`  
>**Method:** `POST`  
>**Body:**

<section class="rest"></section>
```litcoffee
{
  body: {
    // indexes must be an array of index
    indexes: ['myindex'],
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 10
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "searchRoles",
  body: {
    indexes: ['myindex'],
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 10,
    // if hydrate is true, the object is returned as Role object instead of plain elasticsearch document
    hydrate: false
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "searchRoles",
  body: {
    indexes: ['myindex'],
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 10,
    // if hydrate is true, the object is returned as Role object instead of plain elasticsearch document
    hydrate: false
  }  
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "searchRoles",
  body: {
    indexes: ['myindex'],
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 10,
    // if hydrate is true, the object is returned as Role object instead of plain elasticsearch document
    hydrate: false
  }
}
```

>Response

```litcoffee
{
  action: "search",
  collection: "roles",
  controller: "read",
  error: null,
  index: ""%kuzzle",
  metadata: {},
  requestId: "<unique request identifier>",
  result:
  {
     _shards: {
       failed: 0,
       successful: 5,
       total: 5
     },
     hits: [
       {
         _id: 'test',
         _index: '%kuzzle',
         _score: 1,
         _source: {
           _id: 'test',
           indexes: {} // Rights for each indexes, controllers, ... can be found here
         },
         _type: 'roles'
       }
     ],
     max_score: null,
     timed_out: false,
     took: 1,
     total: 1
  },
  scope: null,
  state: 'done',
  status: 200
}
```

Retrieve all roles with rights defined for given `indexes`.  
Attribute `indexes` in body is optional.

Available filters:

| Filter | Type | Description | Default |
|---------------|---------|----------------------------------------|---------|
| ``indexes`` | array | List of indexes id related to the searched role | ``undefined`` |
| ``from`` | number | Starting offset | ``0`` |
| ``to`` | number |  Number of hits to return | ``20`` |

## searchUsers

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/users/_search`  
>**Method:** `POST`  
>**Body**

<section class="rest"></section>
```litcoffee
{
  // 'from' and 'size' argument for pagination
  from: 0,
  size: 10,
  // if hydrate is true, the object is returned as User object instead of plain elasticsearch document
  hydrate: false,
  filter: {
    and: [
      {
        terms: {
          profile: ['anonymous', 'default'],
        }
      },
      {
        geo_distance: {
          distance: '10km',
          pos: {
            lat: '48.8566140', lon: '2.352222'
          }
        }
      }
    ]
  }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket"></section>
```litcoffee
{
  // Required: if your query doesn't include a requestId field, Kuzzle will
  // discard it, as it doesn't have any means to provide you with the result
  requestId: "<Unique query ID>",

  controller: "security",
  action: "searchUsers",
  body: {
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 10,
    // if hydrate is true, the object is returned as User object instead of plain elasticsearch document
    hydrate: false,
    filter: {
      and: [
        {
          terms: {
            profile: ['anonymous', 'default'],
          }
        },
        {
          geo_distance: {
            distance: '10km',
            pos: {
              lat: '48.8566140', lon: '2.352222'
            }
          }
        }
      ]
    }
  }
}
```

<section class="amqp stomp"></section>
```litcoffee
{
  controller: "security",
  action: "searchUsers",
  body: {
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 10,
    // if hydrate is true, the object is returned as User object instead of plain elasticsearch document
    hydrate: false,
    filter: {
      and: [
        {
          terms: {
            profile: ['anonymous', 'default'],
          }
        },
        {
          geo_distance: {
            distance: '10km',
            pos: {
              lat: '48.8566140', lon: '2.352222'
            }
          }
        }
      ]
    }
  }
}
```

<section class="mqtt"></section>
```litcoffee
{
  // Required. If your query doesn't include a clientId field, Kuzzle
  // will discard your query, because it doesn't have any mean to send you
  // the result.
  clientId: "<Unique session ID>",

  controller: "security",
  action: "searchUsers",
  body: {
    // if hydrate is true, the objects are returned as User objects instead of plain elasticsearch documents
    hydrate: false,
    filter: {                     // If empty or missing, Kuzzle will return all users.
      and: [
        {
          terms: {
            profile: ['anonymous', 'default'],
          }
        },
        {
          geo_distance: {
            distance: '10km',
            pos: {
              lat: '48.8566140', lon: '2.352222'
            }
          }
        }
      ]
    },
    // 'from' and 'size' argument for pagination
    from: 0,
    size: 10
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "%kuzzle",
  collection: "users",
  action: "search",
  controller: "security",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    total: <total number of users matching the filter>,
    // An array of user objects
    hits: [
      {
        _id: "<user id>",
        _source: { .. }             // The user object content
      },
      {
        ...
      }
    ]
  }
}
```

Retrieves all the users matching the given filter.

## updateProfile

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/profiles/<profile id>`  
>**Method:** `POST`  
>**Body**

<section class="rest"></section>
```litcoffee
{
    "roles": ["some", "roles"]
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "updateProfile",
  _id: "<profile id>",
  body: {
    "roles": ["some", "roles"]
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "%kuzzle",
  collection: "profiles",
  action: "updateProfile",
  controller: "security",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id: "<user id>",
    _index: "%kuzzle",
    _type: "profiles",
    _version: 2
  }
}
```

Given a `profile id`, updates the matching Profile object in Kuzzle's database layer.


## updateRole

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/roles/<role id>`  
>**Method:** `POST`  
>**Body**

<section class="rest"></section>
```litcoffee
{
    "indexes": {
      "some index": {
        "collections": {
          "some collection": {
            "_canDelete": true
          }
        }
      }
    }
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "updateRole",
  _id: "<role id>",
  body: {
    "indexes": {
      "some index": {
        "collections": {
          "some collection": {
            "_canDelete": true
          }
        }
      }
    }
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "%kuzzle",
  collection: "roles",
  action: "updateRole",
  controller: "security",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id: "<user id>",
    _index: "%kuzzle",
    _type: "roles",
    _version: 2
  }
}
```

Given a `role id`, updates the matching Role object in Kuzzle's database layer.

The body content needs to match Kuzzle's role definition.  

<aside class="warning">
Unlike a regular document update, this method will replace the whole role definition by the body content.<br>
In other words, you always need to provide the complete role definition in the body.
</aside>
To get some more detailed information on the expected role definition, please refer to [Kuzzle's role reference definition documentation](https://github.com/kuzzleio/kuzzle/blob/beta/docs/security/roles-reference.md).

To get some more detailed information about Kuzzle's user management model, please refer to [Kuzzle's security documentation](https://github.com/kuzzleio/kuzzle/blob/master/docs/security/).

## updateUser

<section class="rest"></section>
>**URL:** `http://kuzzle:7511/api/1.0/users/<user id>`  
>**Method:** `POST`  
>**Body**

<section class="rest"></section>
```litcoffee
{
    foo: "bar",                    // Some properties to update
    name: "Walter Smith",
    ...
}
```

<section class="websocket amqp mqtt stomp"></section>
>Query

<section class="websocket amqp mqtt stomp"></section>
```litcoffee
{
  controller: "security",
  action: "updateUser",
  _id: "<user id>",
  body: {
    foo: "bar",                    // Some properties to update
    name: "Walter Smith",
    ...
  }
}
```

>Response

```litcoffee
{
  status: 200,                      // Assuming everything went well
  error: null,                      // Assuming everything went well
  index: "%kuzzle",
  collection: "users",
  action: "updateUser",
  controller: "security",
  state: "done",
  requestId, "<unique request identifier>",
  result: {
    _id: "<user id>",
    _index: "%kuzzle",
    _type: "users",
    _version: 2
  }
}
```

Given a `user id`, updates the matching User object in Kuzzle's database layer.
