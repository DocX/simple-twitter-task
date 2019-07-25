import { index, create } from "./messages";
import Message from "../models/message";
import supertest from "supertest";
import express from "express";
import sequelize from "../models/index";

describe("Messages Endpoint", () => {
  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Message.truncate();
  });

  describe("create", () => {
    let app = express()
      .use(express.json())
      .post("/messages", create);

    it("creates message from JSON:API body", async () => {
      let response = await supertest(app)
        .post("/messages")
        .type("json")
        .send({
          version: "1.0",
          data: {
            type: "messages",
            attributes: {
              body: "this is a message",
              tag: "foo"
            }
          }
        });

      expect(response.status).toBe(201);
      expect(response.header["content-type"]).toEqual(
        "application/vnd.api+json; charset=utf-8"
      );
      expect(response.body.data.id).not.toBeUndefined();
      expect(response.body.data.attributes).toMatchObject({
        body: "this is a message",
        tag: "foo"
      });

      let message = await Message.findOne({
        where: { id: response.body.data.id }
      });
      expect(message).toMatchObject({
        body: "this is a message",
        tag: "foo"
      });
    });

    it("respond with 400 with invalid input", async () => {
      let response = await supertest(app)
        .post("/messages")
        .type("json")
        .send({
          version: "1.0",
          data: {
            type: "messages",
            attributes: {
              body: null,
              tag: ""
            }
          }
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        { path: "body", title: "message.body cannot be null" },
        { path: "tag", title: "Validation notEmpty on tag failed" }
      ]);
    });

    it("only uses body and tag attributes", async () => {
      let response = await supertest(app)
        .post("/messages")
        .type("json")
        .send({
          version: "1.0",
          data: {
            type: "messages",
            attributes: {
              body: "this is a message",
              tag: "foo",
              created_at: "1989-10-22T15:33:00Z",
              something_else: "hello ;)"
            }
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.data.id).not.toBeUndefined();
      expect(response.body.data.attributes).toMatchObject({
        body: "this is a message",
        tag: "foo"
      });
      expect(response.body.data.attributes.created_at).not.toEqual(
        "1989-10-22T15:33:00Z"
      );
    });
  });

  describe("index", () => {
    let app = express().get("/messages", index);

    it("queries messages sorted by last created_at paginated by 50", async () => {
      for (let index = 0; index < 100; index++) {
        await Message.create({
          body: `This is message number ${index}`,
          tag: "foo",
          created_at: new Date(new Date().getTime() - (100 - index) * 60000)
        });
      }

      let response = await supertest(app).get("/messages");

      expect(response.header["content-type"]).toEqual(
        "application/vnd.api+json; charset=utf-8"
      );
      expect(response.body.data).toHaveLength(50);
      expect(response.body.data[0].attributes).toMatchObject({
        body: "This is message number 99"
      });
      expect(response.body.data[49].attributes).toMatchObject({
        body: "This is message number 50"
      });
    });

    it("queries messages sorted by last created_at filtered by a tag", async () => {
      for (let index = 0; index < 50; index++) {
        await Message.create({
          body: `This is message number ${index}`,
          tag: index % 2 == 0 ? "foo" : "bar",
          created_at: new Date(new Date().getTime() - (100 - index) * 60000)
        });
      }

      let response = await supertest(app).get("/messages?filter[tag]=foo");

      expect(response.body.data).toHaveLength(25);
      expect(
        response.body.data.every(item => item.attributes.tag == "foo")
      ).toBeTruthy();
    });

    it("provides pagination link", async () => {
      for (let index = 0; index < 100; index++) {
        await Message.create({
          body: `This is message number ${index}`,
          tag: index % 2 == 0 ? "foo" : "bar",
          created_at: new Date(new Date().getTime() - (100 - index) * 60000)
        });
      }

      let response = await supertest(app).get("/messages?filter[tag]=bar");
      expect(response.body.data[0].attributes).toMatchObject({
        body: "This is message number 99"
      });
      expect(response.body.links).toHaveProperty("next");

      let nextUrl = new URL(response.body.links.next);
      let response2 = await supertest(app).get(
        `${nextUrl.pathname}?${nextUrl.search}`
      );
      expect(response2.status).toBe(200);
      expect(response2.body.data[0].attributes).toMatchObject({
        body: "This is message number 49"
      });
    });
  });
});
