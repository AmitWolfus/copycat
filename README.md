# copycat

A simple, declarative CLI & framework to mock HTTP servers for development and testing purposes

## Defining routes

Mock routes are defined in a declarative manner using JSON files, the root of the JSON should be an object where each property is a root route.

### Simple Routes

Each route can define HTTP method handlers using the following keys: "GET", "POST", "DELETE", "PUT", "PATCH" where the value of the property being the returned body for that route, for example:

```json
{
  "/orders": {
    "GET": {
      "orders": [
        {
          "id": 123,
          "status": "completed"
        }
      ]
    }
  }
}
```

The following JSON defines a route at /myFirstRoute that has a GET endpoint, the GET endpoint returns a fixed array of JSON object with the properties "id" and "status"

### Parameterized routes

copycat uses fastify under the hood and supports route parameters, this can be used to support routes with unknown parameters, for example a GET by id:

```json
{
  "/orders/:id": {
    "GET": {
      "id": 123,
      "status": "pending"
    }
  }
}
```

### Nested Routes

In addition to the HTTP Method properties, it is also possible to define nested routes, the resulting route will be a concatenation of the parent routes, for example the previous routes can be combined into the following definition:

```json
{
  "/orders": {
    "GET": {
      "orders": [
        {
          "id": 123,
          "status": "completed"
        }
      ]
    },
    "/:id": {
      "GET": {
        "id": 123,
        "status": "pending"
      }
    }
  }
}
```

### Controlling the entire response

The previous examples use the simple syntax and define an object that represents the response, sometimes there is a need to control other aspects of the request like setting headers, http status or returning a response that isn't JSON.

In order to take control of the entire response, a route can be defined as an object that contains the property "body" as follows:

```json
{
  "/orders/:id": {
    "PUT": {
      "body": {
        "message": "created"
      },
      "status": 201
    }
  }
}
```

A response supports the following properties:

| Property    | Description                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`    | Sets the response's HTTP status code, defaults to 200, can also be an error code                                                                       |
| `headers`   | A json object with headers to set on the response, default headers are { "content-type": "application/json"} and will be merged with the given headers |
| `condition` | Condition to check if route should run, see [Conditional routes](#conditional-routes)                                                                  |

### Conditional routes

copycat allows routes to have conditions, this along with the possibility to provide an array of handlers to an endpoint allows for complex route handling and test cases.

Conditions are specified in javascript and have access to the body and url params, example:

```json
{
  "/orders/:id": {
    "PUT": [
      {
        "condition": "params.id === 3",
        "status": 404,
        "body": {
          "message": "order not found"
        }
      },
      {
        "condition": "body.status === 'completed'",
        "status": 400,
        "body": {
          "message": "order can't be updated to completed status"
        }
      },
      {
        "body": {
          "message": "updated"
        }
      }
    ]
  }
}
```

## Dynamic responses using templates

copycat support templates using [Handlebars](https://handlebarsjs.com/) templating engine, the template is provided with the request context including the body, route and query params, this allows for dynamic responses based on the request:

```json
{
  "/orders/:id": {
    "GET": {
      "id": "{{ params.id }}",
      "status": "completed"
    }
  }
}
```

### Template helpers

copycat provides a few built-in handlebars helpers to allow generating random data

#### nanoid

Allows creation of random ids using the [nanoid](https://github.com/ai/nanoid) package, usage:

```json
{
  "/orders/:id": {
    "GET": {
      "id": "{{ nanoid . }}",
      "status": "completed"
    }
  }
}
```

#### randomNumberId

Allows creation of random ids made of numbers with a specified length:

```json
{
  "/orders/:id": {
    "GET": {
      "id": "{{ randomNumberId 4 }}",
      "status": "completed"
    }
  }
}
```

#### faker

Allows generating random data using [fakerjs](https://fakerjs.dev/), all methods from fakerjs are supported, usage is as follows:

`"{{ faker  '<namespace>.<function>'}}`

The following example will return a person with a random name and address:

```json
{
  "/people/:id": {
    "GET": {
      "name": "{{ faker 'name.fullName' }}",
      "address": "{{ faker 'address.streetAddress'}}, {{ faker 'address.city' }}"
    }
  }
}
```
