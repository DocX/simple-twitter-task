import express from "express";
import cors from "cors";
import routes from "./routes";
import config from "../config/config";

export default function() {
  let app = express();

  app.use(
    cors({
      origin: config.corsAllowedOrigins
    })
  );

  app.use(routes());

  app.listen(config.listeningPort, () => {
    console.log(`Listening on: ${config.listeningPort}`);
  });

  return app;
}
