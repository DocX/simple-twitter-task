export default {
  development: {
    listeningPort: 4000,
    corsAllowedOrigins: "*",
    jwtSecret: "supersecretsecret"
  },
  test: {
    jwtSecret: "testsupersecretsecret"
  },
  production: {
    jwtSecret: process.env["JWT_SECRET"],
    listeningPort: process.env["PORT"],
    corsAllowedOrigins: "*"
  }
};
