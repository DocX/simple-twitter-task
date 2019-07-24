## Messages Database

In this RFC we explore different alternatives of database technologies and usages for the application.

From the requirements we want to be able to:

- Record a message with its body and a tag
- Query messages based on a tag
- Group messages based on years and/or tag and aggregate their counts

My assumptions further are:

- IDs should be non sequential to obfuscate number of messages
- Application will have higher (let say 10x) query load than write load
- It should be possible to scale for both the write and read load with little effort
- Strong consistency is not required - i.e. writes may appear with some latency in query results
- Messages are immutable - i.e. it is not required or common that the data changes once they are recorded

Potential extensions to requirements that may be considered:

- One message may have multiple tags (1-N)

### Evaluation criteria

To evaluate alternatives, following criteria are chosen:

- Fitness for use case
- Scalability / performance
- High availability setup
- Ease of deployment
- Ease of maintainance - i.e. backups, recoveries, upgrades, etc.
- Ease of use - i.e. available connectors for the backend application code
- Extensibility

### Alternatives

Following evaluation is based on quick research of information available online. For proper evaluation prototype implementation and benchmarking would be considered.

#### PostgreSQL

Model messages as a single table with following columns:

- `id` - UUID, primary key
- `body` - text
- `tag` - text, indexed column
- `created_at` - timestamp, indexed column

Evaluation:

- **Fitness - 8/10** - All required use cases are supported, but many features of the PostgreSQL are not required - transactions, relational schema (as our data do not allow for normalization), isolation nor consistency. On the other hand PostgreSQL is generally considered more [suitable for heavy write loads](http://blog.dumper.io/showdown-mysql-8-vs-postgresql-10/)
- **Scalability / performance - 5/10** - PostgreSQL does not natively provide either sharding or replica setup. There are numerous third party solutions. By default PostgreSQL is limited by the underlying server hardware where database runs, which would at some point become bottleneck. Most of the solutions comes with sacrifying some of the features of the DB like consistency, transactions or relational queries.
- **High availability setup - 5/10** - Similarly, not provided natively, various 3rd party solutions are available.
- **Ease of deployment - 10/10** - Various cloud providers provide hosted PgSQL databases, like AWS RDS
- **Ease of maintainance - 9/10** - Using a hosted solution is relatively easy
- **Ease of use - 8/10** - Available both ORM and native database connectors for Node.js, including support for schema migrations. However the need of ORM itself makes the experience suboptimal to native Node.js.
- **Extensibility - 10/10** - With support of Array type columns and GIN indexes it natively support extending tags to list without need to create JOIN that should avoid hitting query performance.

Total score: 55 / 70

#### MySQL / MariaDB

For MySQL same table schema would be used as in PostgreSQL.

Evaluation:

- **Fitness - 5/10** - All use cases are supported, however generally MySQL is [more suitable for update than write loads](http://blog.dumper.io/showdown-mysql-8-vs-postgresql-10/) which we do not require. Also our application hardly requires relational database as data do not benefit from normalization.
- **Scalability / performance - 8/10** - MariaDB provides native sharding for horizontal scaling, however may not be easy to configure and require proxy setup and may be difficult to add shards on demand.
- **High availability - 8/10** - Native master-slave replication is available.
- **Ease of deploymnet - 10/10** - Similarly to PgSQL, various cloud providers provide hosted MariaDB or MySQL database solutions
- **Ease of maintainance - 9/10** - With standard setups hosted solutions are easy to maintain.
- **Ease of use - 8/10** - Available both ORM and native database connectors for Node.js, including support for schema migrations. However the need of ORM itself makes the experience suboptimal to native Node.js.
- **Extensibility - 5/10** - Extending messages tags to list likely require introducing of a join table, which would impact both write and query performance.

Total score: 53 / 70

#### MongoDB

In MongoDB we would model messages as a collection with documents with following schema:

```
{
    body: "message body",
    tag: "bar",
    created_at: new Timestamp(),
}
```

And signle indexes on `tag` and `created_at` fields.

Evaluation:

- **Fitness - 10/10** - All use cases are supported, while MongoDB does not fundamentally provide features not required. Storing flat collections of documents where normalization and relational joins, nor transactions are required is what MongoDB provides.
- **Scalability / performance - 9/10** - MongoDB provide native sharding to horizontally scale, including built-in shard balancing, but may not be easiest to setup.
- **High availability - 9/10** - MongoDB provides native replica sets, plus sharding also provides partial HA.
- **Ease of deployment - 7/10** - Basic hosted solutions exists, but custom deployment may be required.
- **Ease of maintainance - 7/10** - ?
- **Ease of use - 9/10** - Document store is somewhat very native to Node.js objects and function calls, compared to ORMs or SQL queries. MongoDB have also native connectors for Node.js and packages for migration support exists.
- **Extensibility - 10/10** - Adding support for multi tags is easy as nested lists in documents and multikey indexes are supported.

Total score: 61 / 70

#### Other alternatives not considered

- DynamoDB - not considered due to vendor lock to AWS. If not concern, it may be suitable alternative
- ElasticSearch - while similar to MongoDB as a document store, ElasticSearch is likely an overshot for this use case

### Conclusion

Both MongoDB and PostgreSQL seems to be close candidates. While MongoDB is likely better fit for the use case, PostgreSQL is more readily available as hosted solution and may be easier to setup and maintain while still having great performance.

For my implementation I choose PostgreSQL.
