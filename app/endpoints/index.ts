import * as express from "express";

export function get(req: express.Request, res: express.Response) {
  return res.json({ app: "simple-twitter", status: "ok" });
}
