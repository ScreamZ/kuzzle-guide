## Filtering Syntax

This documentation section details the filtering syntax of **subscriptions**.  
This is different from document searches, which are performed using [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/2.2/query-dsl.html)

Kuzzle subscriptions use a subset of Elasticsearch Query DSL, called Kuzzle DSL.

### Filter terms

### > equals

The `equals` filter matches documents or messages attributes using string equality.

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

The following filter validates the first document:

```javascript
equals: {
  firstName: 'Grace'
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  equals: {
    firstName: 'Grace'
  }
};

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > exists

The `exists` filter matches documents containing non-null fields.

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

The following filter validates the first document:

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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > ids

This filter returns only documents having their unique document ID listed in the provided list.

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

The following filter validates first document:

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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > in

This filter allows testing a string field against multiple possibilities.

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

The following filter validates the first two documents:

```javascript
in: {
  firstName: ['Grace', 'Ada']
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  in: {
    firstName: ['Grace', 'Ada']
  }
};

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > missing

A filter matching documents with a missing field.

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

The following filter validates the second document:

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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > range

Filters documents with fields having number attributes within a certain range.

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

The following filter validates the last two documents:

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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > regexp

The `regexp` filter matches documents or messages attributes using perl-compatible regular expressions ([PCRE](https://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions)).  
You can test only 1 attribute per `regexp` filter.

A `regexp` filter has the following structure, splitting the usual `/pattern/flags` into two parts:

```json
{
  "regexp": {
    "attributeToTest": {
      "value": "search pattern",
      "flags": "modifier flags"
    }
  }
}
```

Or, if you don't wish to add any modifier flags:

```json
{
  "regexp": {
    "attributeToTest": "search pattern"
  }
}
```

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

The following filter validates the first document:

```javascript
regexp: {
  firstName: {
    value: '^g\w+',
    flags: 'i'
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  regexp: {
    firstName: {
      value: '^gr\w+',
      flags: 'i'
    }
  }
};

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### Filter operands

Filter operands allow combining multiple filters using boolean operands.

### > and

The `and` filter takes an array of filter objects, combining them with AND operands.

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

The following filter validates the first document:

```javascript
{
  and: [
    {
      equals: {
        city: 'NYC'
      }
    },
    {
      equals: {
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
        equals: {
          city: 'NYC'
        }
      },
      {
        equals: {
          hobby: 'computer'
        }
      }
    ]
};

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > bool

A filter matching documents matching boolean combinations of other queries.

This operand accepts the following attributes:

* `must`: all listed conditions must be true
* `must_not`: all listed conditions must be false
* `should`: one of the listed condition must be true
* `should_not`: one of the listed condition must be false

Each one of these attributes are an array of filter objects.

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

The following filter validates the second document:

```javascript
{
  bool: {
    must : [
      {
        in : {
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
        equals: {
          city: 'NYC'
        }
      }
    ],
    should : [
      {
        equals : {
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
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
    bool: {
      must : [
        {
          in : {
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
          equals: {
            city: 'NYC'
          }
        }
      ],
      should : [
        {
          equals : {
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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > not

The `not` filter reverts a filter result.

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

The following filter validates the first document:

```
{
  not: {
    equals: {
      city: 'London'
    }
  }
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  not: {
    equals: {
      city: 'London'
    }
  }
};

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > or

The `or` filter takes an array containing filter objects, combining them using OR operands.

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

The following filter validates the first two documents:

```javascript
{
  or: [
    {
      equals: {
        city: 'NYC'
      }
    },
    {
      equals: {
        city: 'London'
      }
    }
  ]
}
```

With the [JavaScript SDK](/sdk-documentation/#subscribe):

```javascript
var filter = {
  or: [
      {
      equals: {
        city: 'NYC'
      }
    },
    {
      equals: {
        city: 'London'
      }
    }
  ]
};

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### Geospatial filters

Geospatial filters allow you to find documents containing a geolocation field.

There are some inherent objects and concepts that are good to understand before going further.

#### Geospatial objects and concepts

  * Point
  * Bounding Box
  * Polygon
  * Distance

##### Point

A point is a single longitude-latitude coordinate pair.

The following notations are accepted and valid:

```javascript
{ lat: -74.1, lon: 40.73 }
```

```javascript
{ lat_lon: { lat: 40.73, lon: -74.1 } }
```

```javascript
{ latLon: { lat: 40.73, lon: -74.1 } }
```

<aside class="note">
When coordinates are in array format, the format is [lon, lat] to comply with <a href="http://geojson.org/">GeoJSON</a>
</aside>

```javascript
{ latLon: [ -74.1, 40.73 ] }
```

```javascript
{ lat_lon: [ -74.1, 40.73 ] }
```

<aside class="note">
As a string, the coordinates format is "lat, lon"
</aside>

```javascript
{ latLon: "40.73, -74.1" }
```

```javascript
{ lat_lon: "40.73, -74.1" }
```

Here is the [geoHash](https://en.wikipedia.org/wiki/Geohash) representation

```javascript
{ latLon: "dr5r9ydj2" }
```

```javascript
{ lat_lon: "dr5r9ydj2" }
```

##### Bounding Box

A bounding box is a 2D box that can be defined using:

1. 2 points coordinates tuples, defining the top left and bottom right corners of the box
2. 4 values defining the 4 box sides: ```top``` and ```bottom``` are latitudes, and ```left``` and ```right``` are longitudes

All of these representations are defining the same bounding box:

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

```javascript
{
  top_left: { lat: 40.73, lon: -74.1 },
  bottom_right: { lat: 40.01, lon: -71.12 }
}
```

<aside class="note">
When cooddinates are in array format, the format is [lon, lat] to comply with <a href="http://geojson.org/">GeoJSON</a>
</aside>

```javascript
{
  topLeft: [ -74.1, 40.73 ],
  bottomRight: [ -71.12, 40.01 ]
}
```

```javascript
{
  top_left: [ -74.1, 40.73 ],
  bottom_right: [ -71.12, 40.01 ]
}
```

<aside class="note">
As a string, the coordinates format is "lat, lon"
</aside>

```javascript
{
  topLeft: "40.73, -74.1",
  bottomRight: "40.01, -71.12"
}
```

```javascript
{
  top_left: "40.73, -74.1",
  bottom_right: "40.01, -71.12"
}
```

Here is the [geoHash](https://en.wikipedia.org/wiki/Geohash) representation

```javascript
{
  topLeft: "dr5r9ydj2",
  bottomRight: "drj7teegp"
}
```

```javascript
{
  top_left: "dr5r9ydj2",
  bottom_right: "drj7teegp"
}
```

##### Polygon

Unlike the GeoJSON representation, a polygon, here, must contain at least 3 [points](#point).  
The last point do not have to be the same as the first one, but the points must be sorted in the right order. The polygon is automatically closed.

For each polygon points, all the possible point notations are valid (see above).

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

By default, when it is not specified, the distance unit is expressed in meters.  
Note that distance values are strings (including `from` and `to` attributes for `geoDistanceRange`)

All formats supported by the [node-units](https://github.com/brettlangdon/node-units) library can be used:

Units   | Notations
--------|----------
meters  | meter, m
feet    | feet, ft
inches  | inch, in
yards   | yard, yd
miles   | mile, mi

All these notations are equivalent:

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


### > geoBoundingBox

Filter documents having their location field within a [bounding box](#geospatial-filters).

![Illustration of geoBoundingBox](./images/geolocation/geoBoundingBox.png)

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  location: {
    lat: 32.692742,
    lon: -97.114127
  }
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  location: {
    lat: 51.519291,
    lon: -0.149817
  }
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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > geoDistance

Filter documents having their location field within a [distance](#geospatial-filters) radius of a provided point of origin.

![Illustration of geoDistance](./images/geolocation/geoDistance.png)

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  location: {
    lat: 32.692742,
    lon: -97.114127
  }
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  location: {
    lat: 51.519291,
    lon: -0.149817
  }
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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```


### > geoDistanceRange

Filter documents having their location field within a [distance](#geospatial-filters) range from a given point of origin

![Illustration of geoDistanceRange](./images/geolocation/geoDistanceRange.png)

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  location: {
    lat: 32.692742,
    lon: -97.114127
  }
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  location: {
    lat: 51.519291,
    lon: -0.149817
  }
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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```

### > geoPolygon

Filter documents having their location field located inside a given [polygon](#geospatial-filters).

![Illustration of geoPolygon](./images/geolocation/geoPolygon.png)

Given the following documents:

```javascript
{
  firstName: 'Grace',
  lastName: 'Hopper',
  location: {
    lat: 32.692742,
    lon: -97.114127
  }
},
{
  firstName: 'Ada',
  lastName: 'Lovelace',
  location: {
    lat: 51.519291,
    lon: -0.149817
  }
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

kuzzle
  .dataCollectionFactory('collection')
  .subscribe(filter, function (error, result) {
    // called each time a new notification on this filter is received
  };
```
