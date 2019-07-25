import express from "express";
import * as Index from "./endpoints/index";
import * as Messages from "./endpoints/messages";

export default function(): express.Router {
  let router = express.Router();

  router.get("/", Index.get);

  router.use(
    (req: express.Request, res: express.Response, next: () => void) => {
      if (req.headers["version"] === undefined) {
        res.status(400);
        res.json({ error: "Requests must contain Version HTTP header" });
      } else {
        next();
      }
    }
  );

  router.use(express.json());

  // Messages
  router.get("/messages", Messages.index);
  router.post("/messages", Messages.create);

  return router;
}
