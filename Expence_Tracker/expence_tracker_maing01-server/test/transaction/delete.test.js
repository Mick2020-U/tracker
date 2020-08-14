const { TestHelper } = require("uu_appg01_workspace-test");

beforeAll(async () => {
  await TestHelper.setup(null, { authEnabled: false });
  // await TestHelper.initApp();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("AwidOwner");
});
afterAll(async () => {
  await TestHelper.teardown();
});

describe("transaction/delete", () => {
  test("example 3 test - transaction/create", async () => {
    let transaction = await TestHelper.executePostCommand("transaction/create", {
      text: "Not the green eyes",
      amount: 20
    });
    let result = await TestHelper.executePostCommand("transaction/delete", { id: transaction.id });
    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });
});
