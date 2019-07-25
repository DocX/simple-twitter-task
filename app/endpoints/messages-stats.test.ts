import { index } from "./messages-stats";
import Message from "../models/message";
import sequelize from "../models/index";
import supertest from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import config from "../../config/config";

describe("MessagesStats endpoint", () => {
  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Message.truncate();
  });

  let app = express().get("/messages-stats", index);

  let validToken = () =>
    jwt.sign(
      { aud: "admin", exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      config[process.env.NODE_ENV].jwtSecret
    );

  describe("Authentication", () => {
    it("respond with 401 when token is not provided", async () => {
      let response = await supertest(app).get("/messages-stats");
      expect(response.status).toBe(401);
    });

    it("respond with 403 when token signed with wrong secret", async () => {
      let token = jwt.sign({ aud: "admin" }, "shhhhh");
      let response = await supertest(app)
        .get("/messages-stats")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it("respond with 403 when token contains wrong audience", async () => {
      let token = jwt.sign(
        { aud: "user" },
        config[process.env.NODE_ENV].jwtSecret
      );
      let response = await supertest(app)
        .get("/messages-stats")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it("respond with 403 when token is expired", async () => {
      let token = jwt.sign(
        { aud: "admin", exp: Math.floor(Date.now() / 1000) - 60 * 60 },
        config[process.env.NODE_ENV].jwtSecret
      );
      let response = await supertest(app)
        .get("/messages-stats")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it("permits when token is correct with admin audience", async () => {
      let response = await supertest(app)
        .get("/messages-stats?groupBy=year")
        .set("Authorization", `Bearer ${validToken()}`);
      expect(response.status).toBe(200);
    });
  });

  let createMessages = async () => {
    await Message.create({
      body: `This is message from 2018`,
      tag: "foo",
      createdAt: new Date("2018-03-23T20:00:12Z")
    });

    await Message.create({
      body: `This is message 1 from 2017`,
      tag: "foo",
      createdAt: new Date("2017-03-23T20:00:12Z")
    });

    await Message.create({
      body: `This is message 2 from 2017`,
      tag: "bar",
      createdAt: new Date("2017-06-23T20:00:12Z")
    });
  };

  it("groups by year", async () => {
    await createMessages();
    let response = await supertest(app)
      .get("/messages-stats?groupBy=year")
      .set("Authorization", `Bearer ${validToken()}`);

    expect(response.body).toEqual([
      { key: 2017, count: "2" },
      { key: 2018, count: "1" }
    ]);
  });

  it("groups by year-tag", async () => {
    await createMessages();
    let response = await supertest(app)
      .get("/messages-stats?groupBy=year-tag")
      .set("Authorization", `Bearer ${validToken()}`);

    expect(response.body).toEqual([
      { key: "2017-bar", count: "1" },
      { key: "2017-foo", count: "1" },
      { key: "2018-foo", count: "1" }
    ]);
  });

  it("groups by year with from", async () => {
    await createMessages();
    let response = await supertest(app)
      .get("/messages-stats?groupBy=year&from=2018-01-01")
      .set("Authorization", `Bearer ${validToken()}`);

    expect(response.body).toEqual([{ key: 2018, count: "1" }]);
  });

  it("groups by year with to", async () => {
    await createMessages();
    let response = await supertest(app)
      .get("/messages-stats?groupBy=year&to=2018-01-01")
      .set("Authorization", `Bearer ${validToken()}`);

    expect(response.body).toEqual([{ key: 2017, count: "2" }]);
  });

  it("groups by year with from and to", async () => {
    await createMessages();
    let response = await supertest(app)
      .get("/messages-stats?groupBy=year&from=2017-06-01&to=2018-01-01")
      .set("Authorization", `Bearer ${validToken()}`);

    expect(response.body).toEqual([{ key: 2017, count: "1" }]);
  });
});
