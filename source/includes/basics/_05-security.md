## Security

Kuzzle provides a full set of functionalities to finely define the permissions for your data.

### Fresh installation default rights.

When installing Kuzzle for the very first time, no default user is created and the Anonymous user is allowed to perform any action on the data. The only restriction is on the internal data storage used by Kuzzle to store its configuration.

Once a first admin user is created, either by accessing [Kuzzle Back Office](https://github.com/kuzzleio/kuzzle-bo) for the first time or by using the [CLI](https://github.com/kuzzleio/kuzzle/tree/master/bin), the Anonymous permissions are dropped.

You can then use the Back Office to administrate your user rights.

### Authentication


The first step to secure your data is to be able to identify your users. Kuzzle ships by default with a local login/password strategy.

Kuzzle uses [passportjs](http://passportjs.org/) to enable authentication with a potentially large amount of providers, for example:
* local username/password authentication (enabled by default)
* oauth2 providers like github or google
* SAML providers
* etc.

You can also use Kuzzle's [Github authentication plugin](https://github.com/kuzzleio/kuzzle-plugin-auth-github) or [develop your own](./authentication.md).

#### How it works

Kuzzle provides a **auth** controller which delegates the authentication strategy to passportjs.

If the passportjs _authenticate_ method resolves an existing user, Kuzzle generates a [JSON Web Token](https://tools.ietf.org/html/rfc7519) that should be used in subsequent requests.

See more details:
* [Authentication scenarios](../request_scenarios/auth.md)
* [Kuzzle API Documentation about Auth Controller](http://kuzzleio.github.io/kuzzle-api-documentation/#auth-controller) and [JWT token usage](http://kuzzleio.github.io/kuzzle-api-documentation/#authorization-header) in Kuzzle requests.

#### How to provide your own strategy

Any strategy supported by passportjs can be implemented for Kuzzle with a dedicated plugin (see [plugins documentation](../plugins.md)).

Take example in [Passport Local plugin](https://github.com/kuzzleio/kuzzle-plugin-auth-passport-local), an authentication plugin must provide following steps:

##### The strategy module

This module is a wrapper to the needed passportjs strategy:

```javascript
// lib/passport/strategy.js
var
  q = require('q'),
  MyNewStrategy = require('passport-my-new-strategy').Strategy;

module.exports = function(context){
  (...)
};
```

It implements:

* a __load__ method to activate the strategy:

```javascript
    this.load = function(passport) {
      passport.use(new MyNewStrategy(this.verify));
    };
```

* a __verify__ method that implements the strategy's [verify callback](http://passportjs.org/docs#verify-callback).

This method accepts a variable numbers of arguments, depending on the strategy, and a _done_ callback that should be invoked when authentication succeed.

NB: because passportjs uses the Callback pattern while Kuzzle uses Promises, you must **promisify** the _done_ callback:

```javascript
    this.verify = function(<params>, done) {
      var deferred = q.defer();

        myCustomVerificationMethod(<params>)
        .then(function (userObject) {
          if (userObject !== null) {
            deferred.resolve(userObject);
          }
          else {
            deferred.reject(new context.ForbiddenError('Bad Credentials'));
          }
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      deferred.promise.nodeify(done);
      return deferred.promise;
    };
```

##### The hook activation

The authController initialization triggers the "auth:loadStrategies" hook event, that can be used to load plugin's strategy, like that:

* declare the hook mapping:

```javascript
// lib/config/hooks.js
module.exports = {
  'auth:loadStrategies': 'loadStrategy',
};
```

* implement the hook method:

```javascript
// lib/index.js
var
  hooks = require('./config/hooks'),
  Strategy = require('./passport/strategy');

module.exports = function () {

  (...)

  this.hooks = hooks;

  this.loadStrategy = function(passport, event) {
    var strategy = new Strategy(this.context);
    strategy.load(passport);
  };

};
```


### Permissions

Once you know who is connected, you need a way to attach your users some permission policies to control their access to data.

#### Users, profiles and roles

Kuzzle associates `users` to a `profile`.  
You can think to a `profile` as a user group. All the `users` that share the same `profile` will get the same accesses.

Because some sets of permissions can be shared between several `profiles`, Kuzzle includes an additional level of abstraction below the `profile`: the `roles`.

A `profile` is a set of `role`. Each `role` defines a set of permissions.

![Users, profiles and roles](https://github.com/kuzzleio/kuzzle/blob/develop/docs/images/kuzzle_security_readme_profiles-roles.png?raw=true)

In the simple example above, the *editor* profile is a superset of the *contributor* one, which, in turn, extends the *default* profile.

### Roles definition

`roles` can be edited in [Kuzzle Back Office](https://github.com/kuzzleio/kuzzle-bo). A `role` definition is a hierarchical JSON object in which permissions can be defined at each data level, from the `index` down to the `action`.

The `role` definition is represented as a hierarchical object for one or more `indexes`.

```js
var myRoleDefinition = {
  indexes: {
    _canCreate: true|false,
    < index|* >: {
      _canDelete: true|false,
      collections: {
        _canCreate: true|false,
        < collection|* >: {
          _canDelete: true|false,
          controllers: {
            < controller|* >: {
              actions: {
                < action|* >: < action permission* >,
                < action|* >: < action permission* >,
                ...
              }
            }
          }
        }
      }
    }
  }
};
```

Each entry of the `indexes`, `collections`, `controllers`, `actions` tree can be set to either an explicit value or the "&#42;" wildcard.

The `action permission` value can be set either to:
* a boolean. When set to `true`, the user is allowed to perform the action.
* an object that describes a function (more about it in the [action permissions functions section](#actions-permissions-functions)).

example:

```js
var anonymousRole = {
  indexes: {
    _canCreate: false,
    "*": {
      _canDelete: false,
      collections: {
        _canCreate: false,
        "*": {
          _canDelete: false,
          controllers: {
            auth: {
              actions: {
                login: true,
                checkToken: true,
                getCurrentUser: true
              }
            }
          }
        }
      }
    }
  }
};
```

The example above is the permission definition set by Kuzzle for the Anonymous user after the first admin user has been created.

In this example, the role denies every action to the user, except the `login`, `checkToken` and `getCurrentUser` actions of the `auth` controller.

#### &#95;canDelete and &#95;canCreate

Some permissions are not related to an index or a collection like for instance creating or deleting an index or a collection.

To handle such cases, the role definition accepts the `_canDelete` and `_canCreate` parameters.

* `_canCreate` needs to be defined _at the level above_ of the target.
* `_canDelete` needs to be defined at the first sub-level of the target.

Example:

```js
var role = {
  indexes: {
    _canCreate: true,
    myIndex: {
      _canDelete: false,
      ...
    }
  }
};
```
The above example allows the user to create any index and forbids to delete the _myIndex_ index.

#### Composition rules

The composition rule is:

> The more specific overrides the less specific.

Example:

```js
var role = {
  indexes: {
    myIndex: {
      collections: {
        "*": {
          controllers: {
            "*": {
              actions: {
                "*": true
              }
            }
          }
        },
        forbiddenCollection: {
          controllers: {
            "*": {
              actions: {
                "*": false
              }
            }
          }
        }
      }
    }
  }
};
```

In the example above, the user is granted any action on any collection of _myIndex_ **except** for the _forbiddenCollection_, for which he is denied any action.

#### Actions permissions functions

So far, we've seen how to set permissions based on the users profiles only.

Now, let's say we have a chat application and want the users to be allowed to edit & delete their own messages only.

This type of rules depends on the context and cannot be expressed as a simple boolean.

Kuzzle lets you define some more complex permissions using a custom function, which can dynamically decide wether the user is allowed to proceed or not depending on the context.

In our chat example, the rule can be expressed as:

```js
var role = {
  indexes: {
    myIndex: {
      collections: {
        chatMessages: {
          controllers: {
            write: {
              actions: {
                create: true,
                delete: {
                  args: {
                    document: {
                      collection: "myIndex",
                      index: "chatMessages",
                      action: {
                        get: "$currentId"
                      }
                    }
                  },
                  test: "return args.document.content.user.id === $currentUserId"
                }
              }
            }
          }
        }
      }
    }
  }
};
```

#### The permission function

The permission function has the following signature:

```js
/**
 * @param {RequestObject} $requestObject  The current action request.
 * @param {Object} context                The current connection context. Contains the connection type and the current user.
 * @param {string} $currentUserId         The current user Id. Shortcut to context.token.user._id
 * @param {Object} args                   The result of the evaluated args definition.
 *
 * @return {Boolean}
 */
function ($requestObject, context, $currentUserId, args) {
  // the function body is built from the "test" parameter
};
```

The permission function is executed in a sandbox with a limited scope. Its body is the evaluation of the _test_ parameter given in the definition.

##### Parameters

###### $requestObject

The request object is the request that is currently being evaluated.  
A typical request object will look like:

```js
var requestObject = {
  index: "myIndex",
  collection: "myCollection",
  controller: "write",
  action: "update",
  data: {
    _id: "id_1",
    body: {
      foo: "bar"
    }
  },
  headers: {
    someHeader: "some header value",
  },
  metadata: {
    someMetadata: "some metadata value"
  },
  requestId: "66978665-1ac5-4770-890c-59cc88f89098",
  timestamp: 14582100322345
};
```

###### context

The context object stores some information about the current connection.  
A typical context object will look like:

```js
var context = {
  connection: {
    id: "/#O3u2-yCDXsYyqLr5AAAA",
    type: "socketio"
  },
  token: {
    _id: undefined,
    expiresAt: null,
    ttl: null,
    user: {
      _id: "login",
      name: "Username",
      profile: {
        // user profile object.
      }
    }
  }
};
```

###### $currentUserId

The _$currentUserId_ variable contains the current user id. It is an alias for `context.token.user._id`.

###### args

The _args_ object contains the result of the evaluation of the fetch definition (cf below).


#### The fetch definition

The optional _args_ parameter given to the permission function is the result of the evaluation of some fetch definition given in the args section of the role definition.

Using this ability, you can pass some documents fetches from Kuzzle's database layer to your permission function.

In our chat example above, we fetch a _document_ variable which contains the the document that was requested for deletion and that we use in the permission function to test if it is owned by the current user.

##### args element structure

The _args_ element has the following structure:

```js
var args = {
    <some variable>: {
      index: <index from which to fetch the document(s)>,
      collection: <collection in which the document(s)  are fetched>,
      action: {
        <action type (get|mget|search)>: <action type specific parameters>
      }
    },
    <another variable>: {
      ...
    },
    ...
};
```

You can define one or more _variables_ inside the args element and, for each of them, the action to use to populate them.

The _variable_ will then be availalbe from your permission function under args._<variable>_.

###### _get_ action type

The `get` action type performs a read/get call. It takes a document id for entry and returns the matching document.

```js
var args = {
    myDocument: {
      index: "myIndex",
      collection: "myCollection",
      action: {
        get: "$currentId"
      }
    }
};
```

###### _mget_ action type

The `mget` action type takes a list of document ids for entry and returns the list of matching documents.

```js
var args = {
  myDocuments: {
    index: "myIndex",
    collection: "myCollection",
    action: {
      mget: [
        "id_1",
        "id_2",
        ...
      ]
    }
  }
};
```

###### _search_ action type

The `search` action type makes a search in Kuzzle's database layer and returns the related documents.

```js
var args = {
  myDocuments: {
    collection: "myCollection",
    action: {
      search: {
        filter: {
          match: {
            name: "$requestObject.data.body.name"
          }
        }
      }
    }
  }
};
```

The action.search value is sent to Kuzzle's database layer directly, being Elasticsearch 1.7.

Please refer to [Elasticsearch search API documentation](https://www.elastic.co/guide/en/elasticsearch/reference/1.7/search-request-body.html) for additional information on how to build your query.

###### available variables

Some variables are exposed by Kuzzle and can be used within your fetch function definition:

* `$currentId`: The current request document id. Shortcut to $requestObject.data.&#95;id.
* `$requestObject`: The complete request object being evaluated.