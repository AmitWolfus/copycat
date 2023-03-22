# copycat

A simple, declarative CLI & framework to mock HTTP servers for development and testing purposes

## Defining routes

Mock routes are defined in a declarative manner using JSON files, the root of the JSON should be an object where each property is a root route.

Each route can define HTTP method handlers using the following keys: "GET", "POST", "DELETE", "PUT", "PATCH" where the value of the property being the returned body for that route, for example:

```json
{
  "/myFirstRoute": {
    "GET": {
      "id": 123,
      "status": "completed"
    }
  }
}
```

The following JSON defines a route at /myFirstRoute that has a GET endpoint, the GET endpoint returns a fixed JSON object with the properties "id" and "status"
