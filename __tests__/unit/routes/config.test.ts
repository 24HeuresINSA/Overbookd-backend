import app from "@server";
import supertest from "supertest";
import * as db from "../../db";

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe("config", () => {
  it("returns config", async () => {
    const { headers, status } = await supertest(app).get("/api/config");
    expect(status).toBe(200);
  });
});
