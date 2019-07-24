## API endpoints design

As of requirements the API should allow:

- A user should be able to send a message with a tag to the server, using API calls
- A user should be able to lookup all the messages containing a specific tag

The API also should use JSON data format.

### Authentication

Given that requirements do not specify need for authentication, we can assume messages are anonymous and hence the API will not provide an authentication.

If we wanted to identify messages in the future, we can introduce authentication using a bearer token and provide a way to login or get token from the backend (it may be different application than this one). Then based on the authentication token provided by the client we could identify the user and store that information alongside the message.

### Versioning

We can assume that the application will grow and change over time. As the API is public, and hence we do not have generally control over our users, in order to allow making breaking changes we should incorporate versioning to the API.

We have following options:

- Use version prefix in endpoint URLs - for example `/v1/messages`
- Use `Version` HTTP header

Prefix versioning is simpler to implement first but may add duplication when new versions are introduced - especially when only part of endpoints need new version, we would need to create routes for all endpoints in new version. It also requires clients to change URLs everytime upgrade to new version is done.

Using `Version` header allows more granular endpoint changes, where each individual endpoint can implement it's versions independently. Adding new version can be just matter of whitelisting that version in each endpoint.

**Proposal:** Use `Version` HTTP header. In the first implementation clients must call API with `Version: 1.0` header. Requests missing the header or having unsupported version will result in `400 Bad Request`.

### Messages JSON schema

Schema defines in what structure the API will receive and send data. Within JSON notation there are two major choices:

- Plain JSON objects - for example message may look like `{ "body": "message body", tags: ["foo", "bar"] }` for create request body or array of those for queries responses
- [JSON:API](https://jsonapi.org/) standard schema

Plain JSON objects are very simple to implemnt, but over time new features or added more complex data structures may pose need of breaking changes.

JSON:API is on the other hand designed with the goal to cover different edge cases and avoid the common mistakes when designing JSON API schemas, which makes it more extensible in the future. Several backend and client implementions makes implementation relatively easy as well.

**Proposal:** Use standard JSON:API v1.0. (Exact schema for specific message entity will be described in another RFC)

### Messages endpoints URL

The API is required to allow creating and querying messages. In other words different operations on an object, which maps exactly into RESTful architecture as Create (POST) and Retrieve (GET) methods on the messages collection.

Moreover it is also required to use `POST` and `GET` methods respectivelly as part of JSON:API standard.

**Proposal:**

- `POST /messages` - create new message
- `GET /messages?tag=bar` - query messages containing given tag
