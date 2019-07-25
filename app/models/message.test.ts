import Message from "./message";
import sequelize from "../models/index";

describe("Message model", () => {
  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Message.truncate();
  });

  it("records message with timestamp", async () => {
    await Message.create({ body: "this is a message", tag: "bar" });
    expect(await Message.count()).toBe(1);
    expect(await Message.findOne().createdAt).not.toBeNull();
  });

  it("queries messages by tag", async () => {
    await Message.create({ body: "this is a message", tag: "bar" });
    await Message.create({ body: "this is a message", tag: "foo" });

    let messages = await Message.findAll({ where: { tag: "bar" } });
    expect(messages).toHaveLength(1);
  });
});
