"use strict";

const TrackerMainUseCaseError = require("./tracker-main-use-case-error.js");
const TRANSACTION_ERROR_PREFIX = `${TrackerMainUseCaseError.ERROR_PREFIX}transaction/`;

const List = {
  UC_CODE: `${TRANSACTION_ERROR_PREFIX}list/`,
  DaoListFailed: class extends TrackerMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}DaoListFailed`;
      this.message = " Get List failed.";
    }
  }
};

const Create = {
  UC_CODE: `${TRANSACTION_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends TrackerMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  DaoCreateFailed: class extends TrackerMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}CreateFailed`;
      this.message = "Create  failed.";
    }
  }
};

const Delete = {
  UC_CODE: `${TRANSACTION_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends TrackerMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

module.exports = {
  Delete,
  Create,
  List
};
