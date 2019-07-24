import supertest from "supertest";
import express from "express";
import * as Index from "./index";

describe("Index endpoint", () => {
  it("returns status JSON and 200", async () => {
    let app = express().get("/", Index.get);
    let response = await supertest(app).get("/");
    expect(response.status).toEqual(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({
      app: "simple-twitter",
      status: "ok"
    });
  });
});
