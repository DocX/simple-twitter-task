import * as express from "express";
import Message from "../models/message";
import Sequelize from "sequelize";

const ALLOWED_CREATE_ATTRIBUTES = ["body", "tag"];
const ALLOWED_FILTER_ATTRIBUTES = ["tag"];

const filterKeys = (allowedKeys: string[], object) =>
  allowedKeys.reduce(
    (acc, key) => ({
      ...acc,
      ...(object[key] !== undefined ? { [key]: object[key] } : null)
    }),
    {}
  );

export async function index(req: express.Request, res: express.Response) {
  let offset = (req.query.page && req.query.page.offset) || 0;
  let limit = 50;

  let messages = await Message.findAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
    where: filterKeys(ALLOWED_FILTER_ATTRIBUTES, req.query.filter || {})
  });

  let nextUrl = new URL(`${req.protocol}://${req.hostname}${req.url}`);
  nextUrl.searchParams.set("page[offset]", offset + limit);

  res.status(200).json({
    data: messages.map(m => ({
      id: m.id,
      type: "messages",
      attributes: {
        body: m.body,
        tag: m.tag,
        created_at: m.created_at
      }
    })),
    links: {
      next: nextUrl.toString()
    }
  });
}

export async function create(req: express.Request, res: express.Response) {
  let attributes = filterKeys(
    ALLOWED_CREATE_ATTRIBUTES,
    req.body.data.attributes
  );

  try {
    let message = await Message.create(req.body.data.attributes);

    res.status(201).json({
      data: {
        id: message.id,
        type: "messages",
        attributes: {
          body: message.body,
          tag: message.tag,
          created_at: message.created_at
        }
      }
    });
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      res.status(400).json({
        errors: e.errors.map(error => ({
          path: error.path,
          title: error.message
        }))
      });
    } else {
      res.status(500).json({
        errors: [
          {
            title: e.message
          }
        ]
      });
    }
  }
}
