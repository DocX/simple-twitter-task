# Simple Twitter

## Start server

With Docker Compose:

```
docker-compose up
```

With local nvm, please make sure postgresql is available on localhost:

```
nvm use
yarn install
export DATABASE_URL=your_postgres_connection_url
export NODE_ENV=production
export JWT_SECRET=secret_secret
yarn run start
```

Open status endpoint [http://localhost:4000](http://localhost:4000)

## Using API

Create new message:

```
curl -H"Version: 1.0" -H"Content-Type: application/vnd.api+json" -XPOST -d '{"data": {"type": "messages", "attributes": {"body": "this is a new message", "tag": "new"}}}' http://localhost:4000/messages
```

List messages:

```
curl -H"Version: 1.0" -H"Content-Type: application/vnd.api+json" http://localhost:4000/messages
```

List messages with specific tag:

```
curl -H"Version: 1.0" -H"Content-Type: application/vnd.api+json" http://localhost:4000/messages?filter[tag]=new
```

## Management API

First obtain JWT token with HS256 signature using secret configured as `JWT_SECRET` environment variable (for docker compose run see `docker-compose.yml` file).

The token has to contain valid `exp` timestamp and `aud` value `admin`. For example this payload is likely to be valid:

```
{
  "aud": "admin",
  "exp": 1000000000000
}
```

Token can be signed for exmple using online tool on [jwt.io](jwt.io)

Get statistics by year:

```
curl -H"Version: 1.0" http://localhost:4000/messages-stats?groupBy=year
```

Get statistics by year and tag:

```
curl -H"Version: 1.0" http://localhost:4000/messages-stats?groupBy=year-tag
```

Optionally add `from` and/or `to` query parameter with ISO8601 formated timestamp to specify range of the statistics generated.
