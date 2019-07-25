import express from "express";
import * as Index from "./endpoints/index";
import * as Messages from "./endpoints/messages";
import * as MessagesStats from "./endpoints/messages-stats";

const requireVersion = (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  if (req.headers["version"] === undefined) {
    res.status(400);
    res.json({ error: "Requests must contain Version HTTP header" });
  } else {
    next();
  }
};

const jsonApiParse = express.json({ type: "application/vnd.api+json" });

const jsonApiType = (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  if (req.headers["content-type"] !== "application/vnd.api+json") {
    res.sendStatus(415);
  } else {
    next();
  }
};

const jsonApiEndpoint = [requireVersion, jsonApiParse, jsonApiType];

export default function(): express.Router {
  let router = express.Router();

  // Status index
  router.get("/", Index.get);

  // Messages
  router.get("/messages", jsonApiEndpoint, Messages.index);
  router.post("/messages", jsonApiEndpoint, Messages.create);

  // Messages Stats
  router.get("/messages-stats", [requireVersion], MessagesStats.index);

  return router;
}
