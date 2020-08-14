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

describe("transaction/list", () => {
  test("example 3 test - transaction/list", async () => {
    let dtoIn = {};
    let result = await TestHelper.executeGetCommand("transaction/list", dtoIn);
    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });
});
