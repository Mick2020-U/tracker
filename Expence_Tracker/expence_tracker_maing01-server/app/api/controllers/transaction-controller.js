"use strict";
const TransactionAbl = require("../../abl/transaction-abl.js");

class TransactionController {

  delete(ucEnv) {
    return TransactionAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return TransactionAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  list(ucEnv) {
    return TransactionAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new TransactionController();
