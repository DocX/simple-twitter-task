import routes from "./routes";
import supertest from "supertest";
import express from "express";
import * as Messages from "./endpoints/messages";
import * as MessagesStats from "./endpoints/messages-stats";

jest.mock("./endpoints/messages");
const MessagesMock = <jest.Mocked<typeof Messages>>Messages;

jest.mock("./endpoints/messages-stats");
const MessagesStatsMock = <jest.Mocked<typeof MessagesStats>>MessagesStats;

describe("Routes", () => {
  it("routes / to Index.get", async () => {
    let app = express().use(routes());
    let response = await supertest(app).get("/");

    expect(response.status).toBe(200);
  });

  describe("Without Version header", () => {
    it("Respond with 400", async () => {
      let app = express().use(routes());
      let response = await supertest(app).get("/messages");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Requests must contain Version HTTP header"
      });
    });
  });

  describe("With other than JSONAPI content type", () => {
    it("Respond with 400", async () => {
      let app = express().use(routes());
      let response = await supertest(app)
        .get("/messages")
        .set("Version", "1.0")
        .set("Content-type", "application/json");

      expect(response.status).toBe(415);
    });
  });

  it("routes GET /messages to Messages.index", async () => {
    MessagesMock.index.mockImplementation((req, res) => res.sendStatus(200));
    let app = express().use(routes());
    let response = await supertest(app)
      .get("/messages")
      .set("Version", "1.0")
      .set("Content-type", "application/vnd.api+json");

    expect(response.status).toBe(200);
  });

  it("routes POST /messages to Messages.create", async () => {
    MessagesMock.create.mockImplementation((req, res) => res.sendStatus(201));
    let app = express().use(routes());
    let response = await supertest(app)
      .post("/messages")
      .set("Version", "1.0")
      .set("Content-type", "application/vnd.api+json");

    expect(response.status).toBe(201);
  });

  it("routes GET /messages-stats to MessagesStats.index", async () => {
    MessagesStatsMock.index.mockImplementation((req, res) =>
      res.sendStatus(200)
    );
    let app = express().use(routes());
    let response = await supertest(app)
      .get("/messages-stats")
      .set("Version", "1.0");

    expect(response.status).toBe(200);
  });

  it("respond 404 for other routers", async () => {
    let app = express().use(routes());
    let response = await supertest(app)
      .get("/does-not-exists")
      .set("Version", "1.0")
      .set("Content-type", "application/vnd.api+json");

    expect(response.status).toBe(404);
  });
});
