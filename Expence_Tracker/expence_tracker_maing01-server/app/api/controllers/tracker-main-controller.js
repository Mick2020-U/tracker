"use strict";
const TrackerMainAbl = require("../../abl/tracker-main-abl.js");

class TrackerMainController {
  init(ucEnv) {
    return TrackerMainAbl.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new TrackerMainController();
