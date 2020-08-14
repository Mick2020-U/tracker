"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/transaction-error.js");

const WARNINGS = {
  create: {
    createUnsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`
    }
  },
  list: {
    unsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`
    }
  },
  delete: {
    unsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`
    }
  }
};

class TransactionAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "transaction-types.js"));
    this.dao = DaoFactory.getDao("transaction");
  }

  async delete(awid, dtoIn) {
    let validationResult = this.validator.validate("transactionDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.delete.unsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    let dtoOut = {};
    try {
      await this.dao.delete(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        console.log(e);
      }
      throw e;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async create(awid, dtoIn) {
    let validationResult = this.validator.validate("transactionCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.create.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.DaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn) {
    let dtoOut;
    let validationResult = this.validator.validate("transactionListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.list.unsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    try {
      dtoOut = await this.dao.list(awid, dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.List.DaoListFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new TransactionAbl();
