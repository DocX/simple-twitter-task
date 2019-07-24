## Framework choice

Simple Twitter application consists of a server application that will provide a HTTP JSON API to create and query "twitter" messages.

This document will explore programming langugages and frameworks to choose to implement this server.

### Assumptions

- It is given limited time to develop and deploy the application.
- It should be able to scale 3000 create requests per minute without significant effort and let say ten times more query requests. It is 1% of twitter traffic, which [states around 500M tweets per day](https://www.sec.gov/Archives/edgar/data/1418091/000119312513390321/d564001ds1.htm)
- Operational cost is not priority in this stage
- We do not expect to extend application beyond JSON API use case

### Evaluation criteria

Given the above assumptions, we will choose following evaluation criteria and their weights:

- Familiarity - 30
- Track of record (real world tested) and support for HTTP JSON API applications - 30
- Ease of deployment - 20
- Cost of operation / performance - 10
- Scalability - 20
- Extensibility - 10

### Alternatives

#### Ruby / Ruby on Rails

- **Familiarity: 30/30**
- **Track of record / support: 30/30** - Ruby on Rails is most popupar web framework in Ruby ecosystem. Comunity gems include extensive variety of plugins that integrate with Ruby on Rails framework for security, authentication, database connectors and JSON API rendering.
- **Ease of deployment: 20/20** - Heroku, Google App Engine and others have full support of Ruby web apps
- **Cost / performance: 2/10** - [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune) Rails ranks 320th out of 370 tested frameworks
- **Scalability: 10/20** - Easy to horizontally scale by adding more nodes with a load balancer, with only limit on downstream database connections. Around 20 nodes may be requered based on 1,636 requests per second per node in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Extensibility: 10/10** - Ruby on Rails is fully featured framework for building HTTP API applications.

Total score: 102

#### Ruby / Sinatra

- **Familiarity: 21/30**
- **Track of record / support: 20/30** - Ok documentation, not many resources on real world usage
- **Ease of deployment: 20/20** - Same as Ruby on Rails
- **Cost / performance: 3/10** - 284th out of 370 in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Scalability: 12/20** - Around 10 nodes may be required based on 3,094 requests per second per node in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Extensibility: 7/10** - Not as many gems as in Ruby on Rails are supported in Sinatra.

Total score: 83

#### Elixir / Phoenix

- **Familiarity: 24/30**
- **Track of record / support: 30/30** - Phoenix and Elixir has great documentation, [real world companies using the framework](https://phoenixframework.org/)
- **Ease of deployment: 10/20** - Elixir is not usually out of the box supported on most popular cloud providers.
- **Cost / performance: 5/10** - 197th out of 370 in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Scalability: 18/20** - Around 5 nodes may be required based on 8,528 requests per second per node in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Extensibility: 9/10** - Phoenix is fully featured web framework with growing ecosystem of plugins including security, JSON-API, database connectors.

Total score: 96

#### Node.js / Express

- **Familiarity: 27/30**
- **Track of record / support: 30/30** - https://expressjs.com/en/resources/companies-using-express.html
- **Ease of deployment: 20/20 (20)** - Heroku, Google Cloud, AWS provide deployment of Node.js applications out of the box.
- **Cost / performance: 5/10 (5)** - 200th out of 370 in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Scalability: 18/20** - Around 5 nodes may be required based on 8,428 equests per second per node in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Extensibility: 10/10** - Node.js and Express.js ecosystem provides variaty of extensions to full featured web development

Total score: 110

#### Go / fasthttp or chi

- **Familiarity: 0/30**
- **Track of record / support: 30/30** - Go is multipurpose, real world tested language.
- **Ease of deployment: 20/20** - Heroku, Google Cloud and others support Go out of the box.
- **Cost / performance: 10/10** - Go with fasthttp or chi ranks amongs first 50 in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune)
- **Scalability: 20/20** - 30,265 requests per second per node in [TechEmpower's Fortunes benchmark](https://www.techempower.com/benchmarks/#section=data-r18&hw=cl&test=fortune) requires only single node to cover the load,
- **Extensibility: 8/10**

Total score: 88

### Conslusion

The framework with highest score is Express on Node.js.
