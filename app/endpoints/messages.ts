import * as express from "express";

export function index(req: express.Request, res: express.Response) {
  res.sendStatus(200);
}

export function create(req: express.Request, res: express.Response) {
  res.sendStatus(201);
}
