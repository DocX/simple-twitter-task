export default {
  development: {
    listeningPort: 4000,
    corsAllowedOrigins: "*",
    database: {
      username: "postgres",
      password: "postgres",
      database: "database_development",
      host: "127.0.0.1",
      dialect: "postgres",
      operatorsAliases: false
    }
  },
  test: {
    database: {
      username: "postgres",
      password: "postgres",
      database: "database_test",
      host: "127.0.0.1",
      dialect: "postgres",
      operatorsAliases: false
    }
  },
  production: {
    listeningPort: process.env["PORT"],
    corsAllowedOrigins: "*",
    database: {}
  }
};
