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

describe("Create transaction", () => {
  test("example 3 test - transaction/create", async () => {
    let dtoIn = {
      text: "1215AC",
      amount: 200
    };
    let result = await TestHelper.executePostCommand("transaction/create", dtoIn);

    expect(result.data.text).toEqual(dtoIn.text);
    expect(result.data.amount).toEqual(dtoIn.amount);
    expect(result.data.uuAppErrorMap).toEqual({});
  });
  test("A4 - dtoIn is not valid", async () => {
    try {
      await TestHelper.executePostCommand("transaction/create", { text: "Nehorlavy petrolej", amount: [] });
    } catch (e) {
      expect(e.code).toEqual("expence-tracker-main/transaction/create/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });
  // test("A3 - unsupported keys in dtoIn", async () => {
  //   let transaction = await TestHelper.executePostCommand("transaction/create", {
  //     text: "Hrebik v zasuvce",
  //     navic: "ja jsem navic"
  //   });
  //   expect(transaction.status).toEqual(200);
  //   let warning = transaction.uuAppErrorMap["expence-tracker-main/transaction/create/unsupportedKeys"];
  //   expect(warning).toBeTruthy();
  //   expect(warning.type).toEqual("warning");
  //   expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  //   expect(warning.paramMap.unsupportedKeyList).toEqual(["$.navic"]);
  // });
});
