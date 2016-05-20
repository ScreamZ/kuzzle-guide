## Filtering Syntax

For real-time subscription we use a sub language of Elasticsearch DSL, only for [Filters](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-filters.html).

For no-real-time, like search, get, etc, we directly pass information to Elasticsearch. You can use the whole [Elasticsearch DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

You can also take a look at the internally used [Elasticsearch API](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html) for Javascript

### and

The and filter allow to filter documents on two or more terms.

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  city: 'NYC',
  hobby: 'computer'
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  city: 'London',
  hobby: 'computer'
}
```

The following filter can be made, and will be validated on the first document: 

```javascript
{
  and: [
    {
      term: {
        city: 'NYC'
      }
    },
    {
      term: {
        hobby: 'computer'
      }
    }
  ]
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```js
var filter = {
    and: [
      {
        term: {
          city: 'NYC'
        }
      },
      {
        term: {
          hobby: 'computer'
        }
      }
    ]
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### bool

A filter that matches documents matching boolean combinations of other queries. 

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  age: 85,
  city: 'NYC',
  hobby: 'computer'
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  age: 36
  city: 'London',
  hobby: 'computer'
},
{
  firstName: 'Marie',
  lastName: 'Curie',
  age: 55,
  city: 'Paris',
  hobby: 'radium'
}
```

The following filter can be made, and will be validated on the second document: 

```javascript
bool: {
  must : [
    {
      terms : {
        firstName : ['Grace', 'Ada']
      }
    },
    {
      range: {
        age: {
          gte: 36,
          lt: 85
        }
      }
    }
  ],
  'must_not' : [
    {
      term: {
        city: 'NYC'
      }
    }
  ],
  should : [
    {
      term : {
        hobby : 'computer'
      }
    },
    {
      exists : {
        field : 'lastName'
      }
    }
  ]
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
    bool: {
      must : [
        {
          terms : {
            firstName : ['Grace', 'Ada']
          }
        },
        {
          range: {
            age: {
              gte: 36,
              lt: 85
            }
          }
        }
      ],
      'must_not' : [
        {
          term: {
            city: 'NYC'
          }
        }
      ],
      should : [
        {
          term : {
            hobby : 'computer'
          }
        },
        {
          exists : {
            field : 'lastName'
          }
        }
      ]
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### exists

Returns documents that have at least one non-null value in the original field.

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  city: 'NYC',
  hobby: 'computer',
  alive: false
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  city: 'London',
  hobby: 'computer'
}
```

The following filter can be made, and will be validated on the first document: 

```javascript
{
  exists: {
    field: 'alive'
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```js
var filter = {
  exists: {
    field: 'alive'
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### missing

Returns documents that have only null values or no value in the original field

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  city: 'NYC',
  hobby: 'computer',
  alive: false
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  city: 'London',
  hobby: 'computer',
}
```

The following filter can be made, and will be validated on the second document:
 
```javascript
{
  missing: {
    field: 'alive'
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```js
var filter = {
  missing: {
    field: 'alive'
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### not

A filter that filters out matched documents.

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  city: 'NYC',
  hobby: 'computer'
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  city: 'London',
  hobby: 'computer'
}
```

The following filter can be made, and will be validated on the first document: 

```
{
  not: {
    term: {
      city: 'London'
    }
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  not: {
    term: {
      city: 'London'
    }
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### or

A filter that matches documents using the OR boolean operator on other filters.

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  city: 'NYC',
  hobby: 'computer'
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  city: 'London',
  hobby: 'computer'
},
{
  firstName: 'Marie',
  lastName: 'Curie',
  city: 'Paris',
  hobby: 'radium'
}
```

The following filter can be made, and will be validated on the first and second documents: 

```javascript
{
  or: {
    term: {
      city: 'NYC'
    }
  },
  {
    term: {
      city: 'London'
    }
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  or: {
    term: {
      city: 'NYC'
    }
  },
  {
    term: {
      city: 'London'
    }
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### term

Filters documents that have fields that contain a term.

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper'
},
{
  firstName: 'Ada',
  lastName: 'Lovelace'
}
```

The following filter can be made, and will be validated on the first document: 

```javascript
term: {
  firstName: 'Grace'
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  term: {
    firstName: 'Grace'
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### terms

Filters documents that have fields that match any of the provided terms.

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper'
},
{
  firstName: 'Ada',
  lastName: 'Lovelace'
},
{
  firstName: 'Marie',
  lastName: 'Curie'
}
```

The following filter can be made, and will be validated on the two first documents: 

```javascript
terms: {
  firstName: ['Grace', 'Ada']
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  term: {
    firstName: ['Grace', 'Ada']
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### ids

Filters documents that only have the provided ids.

Given the following documents:

```javascript
{
  _id: 'a',
  firstName: 'Grace',
  lastName: 'Hopper'
},
{
  _id: 'b',
  firstName: 'Ada',
  lastName: 'Lovelace'
},
{
  _id: 'c',
  firstName: 'Marie',
  lastName: 'Curie'
}
```

The following filter can be made, and will be validated on the first document: 

```javascript
ids: {
  values: ['a']
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  ids: {
    values: ['a']
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### range

Filters documents with fields that have terms within a certain range.

The range filter accepts the following parameters:

```gte``` Greater-than or equal to

```gt``` Greater-than

```lte``` Less-than or equal to

```lt``` Less-than

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  age: 85,
  city: 'NYC',
  hobby: 'computer'
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  age: 36
  city: 'London',
  hobby: 'computer'
},
{
  firstName: 'Marie',
  lastName: 'Curie',
  age: 55,
  city: 'Paris',
  hobby: 'radium'
}
```

The following filter can be made, and will be validated on the two last documents, not the first: 

```javascript
range: {
  age: {
    gte: 36,
    lt: 85
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  range: {
    age: {
      gte: 36,
      lt: 85
    }
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

### Geospacial

The geospacial filters allows you to find or discriminate documents containing a geolocalisation field (ie: a point).

There are some inherent objects and concepts wich are good to understand before to go further. Most of them are following the ElasticSearch DSL format, some has been simplified.

#### Geospacial objects and concepts

  * [Point](#point)
  * [Bounding Box](#bounding-box) aka BBox
  * [Polygon](#polygon)
  * [Distance](#distance)

##### Point

A point is... well you know, a point, defined by a longitude and a latitude.
The following notations are valid: 

```javascript
{ lat: -74.1, lon: 40.73 }
```

```javascript
{ latLon: { lat: 40.73, lon: -74.1 } }
```

<aside class="warning">
When cooddinates are in array format, the format is [lon, lat] to comply with [ElasticSearch DSL definition](https://www.elastic.co/guide/en/elasticsearch/reference/1.4/query-dsl-geo-bounding-box-filter.html#_lat_lon_as_array_3)
</aside>

```javascript
{ latLon: [ -74.1, 40.73 ] }
```

<aside class="warning">
As a string, the coordinates format is "lat, lon"
</aside>

```javascript
{ latLon: "40.73, -74.1" }
```

Here is the [geoHash](https://en.wikipedia.org/wiki/Geohash) representation

```javascript
{ latLon: "dr5r9ydj2" }
```

##### Bounding Box

A bounding box (also known as BBox) is a 2D box that can be defined via:

1. 2 points coordinates tuples, defining the top left and bottom right corners of the box
2. 4 values defining the 4 BBox sides. ```top``` and ```bottom``` are latitudes and ```left``` and ```right``` are longitudes

All of these representations are defining the same BBox: 

```javascript
{
  top: -74.1,
  left: 40.73,
  bottom: -71.12,
  right: 40.01
}
```

```javascript
{
  topLeft: { lat: 40.73, lon: -74.1 },
  bottomRight: { lat: 40.01, lon: -71.12 }
}
```

<aside class="warning">
When cooddinates are in array format, the format is [lon, lat] to comply with [ElasticSearch DSL definition](https://www.elastic.co/guide/en/elasticsearch/reference/1.4/query-dsl-geo-bounding-box-filter.html#_lat_lon_as_array_3)
</aside>

```javascript
{
  topLeft: [ -74.1, 40.73 ], 
  bottomRight: [ -71.12, 40.01 ]
}
```

<aside class="warning">
As a string, the coordinates format is "lat, lon"
</aside>

```javascript
{
  topLeft: "40.73, -74.1", 
  bottomRight: "40.01, -71.12"
}
```

Here is the [geoHash](https://en.wikipedia.org/wiki/Geohash) representation

```javascript
{
  topLeft: "dr5r9ydj2", 
  bottomRight: "drj7teegp"
}
```

##### Polygon

Unlike the GeoJSON representation, a polygon, here, must contain at least, 3 [points](#point) ; the last point do not have to be the same as the first one, but the points must be in the right order. The polygon is automatically closed.

For each polygon points, all the possible point notations are valid.

Example of a valid polygon representation: 

```javascript
{
  points: [
    [0,0],
    {lon: 1, lat: 2},
    '2,1',
    's037ms06g'
  ]
}
```

##### Distance

By default, when it is not specified, the distance unit is meters.
You can use other units accepted by the excellent [node-units](https://github.com/brettlangdon/node-units) library, so all units and prefix that library can handle are supported, such as the following, using a lower, upper or camelized notation:

Units   | Notations
--------|----------
meters  | meter, m
feet    | feet, ft
inches  | inch, in
yards   | yard, yd
miles   | mile, mi

According to this, all these notations are equivalent: 

```
1000
1000 m
1km
3280.839895013123 ft
3280.839895013123FT
39370.078740157485 inches
39370.078740157485 inch
39370.078740157485 in
1 093,6132983377079 yd
0.6213727366498067 miles
```
#### Geospacial filters

##### geoBoundingBox

Filter documents wich have a location field and are located into a [bounding box](#bounding-box).

![Illustration of geoBoundingBox](https://github.com/kuzzleio/kuzzle/blob/develop/docs/images/kuzzle_geoBoundingBox.png?raw=true)

Given the following documents: 

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  'location.lat': 32.692742,
  'location.lon': -97.114127
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  'location.lat': 51.519291,
  'location.lon': -0.149817
}
```

The following filter will match the second document only:

```javascript
geoBoundingBox: {
  location: {
    top: -2.939744,
    left: 52.394484,
    bottom: 1.180129,
    right: 51.143628
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  geoBoundingBox: {
    location: {
      top: -2.939744,
      left: 52.394484,
      bottom: 1.180129,
      right: 51.143628
    }
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

##### geoDistance

Filter documents wich have a location field and are located into a given [distance](#distance) from a given point.

![Illustration of geoDistance](https://github.com/kuzzleio/kuzzle/blob/develop/docs/images/kuzzle_geoDistance.png?raw=true)

Given the following documents: 

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  'location.lat': 32.692742,
  'location.lon': -97.114127
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  'location.lat': 51.519291,
  'location.lon': -0.149817
}
```

The following filter will match the second document only:

```javascript
geoDistance: {
  location: {
    lat: 51.5029017,
    lon: -0.1606903
  },
  distance: '10km'
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  geoDistance: {
    location: { // Buckingham Palace
      lat: 51.5029017,
      lon: -0.1606903
    },
    distance: '10km'
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

##### geoDistanceRange

Filter documents wich have a location field and are located into a given [distances](#distance) range from a given point.

![Illustration of geoDistanceRange](https://github.com/kuzzleio/kuzzle/blob/develop/docs/images/kuzzle_geoDistanceRange.png?raw=true)


Given the following documents: 

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  'location.lat': 32.692742,
  'location.lon': -97.114127
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  'location.lat': 51.519291,
  'location.lon': -0.149817
}
```

The following filter will match the second document only:

```javascript
geoDistanceRange: {
  location: {
    lat: 51.5029017,
    lon: -0.1606903
  },
  from: '1km',
  to: '10km'
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  geoDistanceRange: {
    location: { // Buckingham Palace
      lat: 51.5029017,
      lon: -0.1606903
    },
    from '1km',
    to: '10km'
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```

##### geoPolygon

Filter documents wich have a location field and are located into a given [polygon](#polygon).

![Illustration of geoPolygon](https://github.com/kuzzleio/kuzzle/blob/develop/docs/images/kuzzle_geoPolygon.png?raw=true)

Given the following documents: 

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  'location.lat': 32.692742,
  'location.lon': -97.114127
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  'location.lat': 51.519291,
  'location.lon': -0.149817
}
```

The following filter will match the second document only:

```javascript
geoPolygon: {
  location: {
    points: [
      { lat: 51.523029, lon: -0.160793 },
      { lat: 51.522842, lon: -0.145043 },
      { lat: 51.518303, lon: -0.146116 },
      { lat: 51.516487, lon: -0.162295 },
      { lat: 51.520226, lon: -0.158432 }
    ]
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  geoPolygon: {
    location: {
      points: [
        { lat: 51.523029, lon: -0.160793 },
        { lat: 51.522842, lon: -0.145043 },
        { lat: 51.518303, lon: -0.146116 },
        { lat: 51.516487, lon: -0.162295 },
        { lat: 51.520226, lon: -0.158432 }
      ]
    }
  }
};

var room =
  kuzzle
    .dataCollectionFactory('collection')
    .subscribe(filter, function (error, result) {
      // called each time a new notification on this filter is received
    };
```