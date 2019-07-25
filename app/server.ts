import express from "express";
import cors from "cors";
import routes from "./routes";
import config from "../config/config";

export default function() {
  let app = express();
  let currentConfig = config[process.env["NODE_ENV"] || "development"];

  app.use(
    cors({
      origin: currentConfig.corsAllowedOrigins
    })
  );

  app.use(routes());

  console.log({ currentConfig });

  app.listen(currentConfig.listeningPort, () => {
    console.log(`Listening on: ${currentConfig.listeningPort}`);
  });

  return app;
}
