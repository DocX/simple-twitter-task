export default {
  development: {
    listeningPort: 4000,
    corsAllowedOrigins: "*",
    jwtSecret: "supersecretsecret",
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
    jwtSecret: "testsupersecretsecret",
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
    jwtSecret: process.env["JWT_SECRET"],
    listeningPort: process.env["PORT"],
    corsAllowedOrigins: "*",
    database: {}
  }
};
