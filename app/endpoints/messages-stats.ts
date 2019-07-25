import jwt from "jsonwebtoken";
import express from "express";
import config from "../../config/config";
import Message from "../models/message";
import Sequelize from "sequelize";

const BEARER_TOKEN = /^bearer (.+)$/i;

function authorize(req: express.Request, res: express.Response): boolean {
  let authorization = req.header("Authorization");
  if (authorization === undefined || authorization === null) {
    res.sendStatus(401);
    return false;
  }

  let result = BEARER_TOKEN.exec(authorization);
  if (result === null) {
    res.sendStatus(401);
    return false;
  }

  let token = result[1];

  try {
    jwt.verify(token, config[process.env.NODE_ENV || "development"].jwtSecret, {
      algorithms: ["HS256"],
      audience: "admin"
    });
    return true;
  } catch (e) {
    res.sendStatus(403);
    return false;
  }
}

const GROUP_KEYS_MAPPING = {
  year: Sequelize.fn("date_part", "year", Sequelize.col("created_at")),
  "year-tag": Sequelize.fn(
    "concat",
    Sequelize.fn("date_part", "year", Sequelize.col("created_at")),
    "-",
    Sequelize.col("tag")
  )
};

function validateDate(value) {
  if (value === undefined) {
    return true;
  }

  let date = new Date(value);
  if (isNaN(date.getTime())) {
    return false;
  } else {
    return true;
  }
}

export async function index(req: express.Request, res: express.Response) {
  if (!authorize(req, res)) {
    return;
  }

  if (
    req.query.groupBy === undefined ||
    !(req.query.groupBy in GROUP_KEYS_MAPPING)
  ) {
    res
      .status(400)
      .json({ error: "'groupBy' query parameter must be provided" });
    return;
  }

  if (!validateDate(req.query.to) || !validateDate(req.query.from)) {
    res
      .status(400)
      .json({ error: "'from' or 'to' query parameters are invalid" });
    return;
  }

  let where = {};
  if (req.query.to || req.query.from) {
    where = {
      createdAt: {
        ...(req.query.to && { [Sequelize.Op.lt]: new Date(req.query.to) }),
        ...(req.query.from && { [Sequelize.Op.gt]: new Date(req.query.from) })
      }
    };
  }

  let groupKey = GROUP_KEYS_MAPPING[req.query.groupBy];

  let groups = await Message.findAll({
    attributes: [
      [groupKey, "key"],
      [Sequelize.fn("count", Sequelize.col("id")), "count"]
    ],
    group: [groupKey],
    order: [[groupKey, "ASC"]],
    where
  });

  res.json(groups);
}
