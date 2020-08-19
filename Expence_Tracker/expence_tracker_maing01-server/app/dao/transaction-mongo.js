"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TransactionMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }
  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
  async list(awid, sortBy, order, pageInfo) {
    let sort = {
      [sortBy]: order === "asc" ? 1 : -1
    };
    return await super.find({}, pageInfo, sort);
  }
  async delete(awid, id) {
    return await super.deleteOne({ id });
  }
}

module.exports = TransactionMongo;
