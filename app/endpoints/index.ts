import * as express from "express";

export function get(req: express.Request, res: express.Response) {
  res.json({ app: "simple-twitter", status: "ok" });
}
