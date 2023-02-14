const express = require("express");
const router = express.Router();
const ipAllowed = require("ip-allowed");

// Router Routes
const Auth_Router = require("./auth");
const db_Router = require("./db");
const storage_Router = require("./storage");

router.use(express.static(__dirname + "\\doc"));

const API_IP_WHITELIST = ipAllowed(["0.0.0.0"], {
  log: false,
});
// this Api is protected via ip whitelist
router.use(API_IP_WHITELIST);
// The API Routes
router.use("/auth", Auth_Router);
router.use("/db", db_Router);
router.use("/storage", storage_Router);

module.exports = router;
