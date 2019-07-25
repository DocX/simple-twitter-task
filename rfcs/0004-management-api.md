## Management API

There should be a management API to allow grouping tweets by timeframe (e.g. per year from 2005 to 2010). It's most likely not helpful to return thousands of tweets, but rather return a count of tweets per timeframe or a count of tweets for a specific tag per timeframe to see trends.

### Authentication

Assuming that this API should be accessible only to authorized users, it needs to provide a way to authenticate and authorize requests.

The API will require `Authorization` HTTP header with a `Bearer`. For simplicity and removing the concern of authentication from the scope of this application, we will use JWT standard with preshared key signature. Tokens that will be signed with same key and will contain `admin` audience will be allowed.

Example payload:

```
{
  "sub": "1234567890",
  "name": "John Doe",
  "aud": "admin",
  "iat": 1516239022
}
```

May result in following token with `mysecret` secret:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYXVkIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.-ssXvPeHQq1mPMlrve1G_TH1F3KG6qAcLpcEY11TKDQ
```

In case authorization header is not provided or does not match signature, `401` error code is send as response.

If valid JWT token is provided as bearer token but `aud` payload does not contain `admin`, `403` code will be returned.

### API schema

Specified functionality will be provided via single URL endpoint with query parameters specifying desired grouping:

`GET /messages-stats?groupBy=year&from=2015-01-01&to=2018-01-01`

Parameters:

- `groupBy` - required, allowed values are `year` or `year-tag`. `year` will aggregate counts by year of creation with keys of year, `year-tag` will aggregate by year and tag with year and tag contacatenated with a dash as a keys.
- `from` - optional, date in `YYYY-MM-DD` format to limit query for messages created at or after that date
- `to` - optional, date in `YYYY-MM-DD` format to limit query for messages created before that date

Response:

```
{
    "2015": 23,
    "2016": 56,
    "2017": 66
}
```

Response will be plain JSON object with keys based on the `groupBy` parameter and values are count of messages in given group.
