import express from "express";
import * as Index from "./endpoints/index";

export default function(): express.Router {
  let router = express.Router();

  router.get("/", Index.get);

  return router;
}
