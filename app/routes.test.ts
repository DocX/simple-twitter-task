import routes from "./routes";
import supertest from "supertest";
import express from "express";

describe("Routes", () => {
  it("routes / to Index.get", async () => {
    let app = express().use(routes());
    let response = await supertest(app).get("/");

    expect(response.status).toBe(200);
  });

  describe("Without Version header", () => {
    it("Respond with 400 to any URL", async () => {
      let app = express().use(routes());
      let response = await supertest(app).get("/something");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Requests must contain Version HTTP header"
      });
    });
  });

  it("routes GET /messages to Messages.index", async () => {
    let app = express().use(routes());
    let response = await supertest(app)
      .get("/messages")
      .set("Version", "1.0");

    expect(response.status).toBe(200);
  });

  it("routes POST /messages to Messages.create", async () => {
    let app = express().use(routes());
    let response = await supertest(app)
      .post("/messages")
      .set("Version", "1.0");

    expect(response.status).toBe(201);
  });

  it("respond 404 for other routers", async () => {
    let app = express().use(routes());
    let response = await supertest(app)
      .get("/does-not-exists")
      .set("Version", "1.0");

    expect(response.status).toBe(404);
  });
});