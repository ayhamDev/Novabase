require("dotenv").config();
require("colors");
const express = require("express");
const cookies = require("cookie-parser");
const Api_Router = require("./src/Api/index.js");
const app = express();
const cors = require("cors");

const mongodb = require("./src/utils/mongodb.js");
const Novabase = require("./src/utils/Novabase.js");
const PORT = process.env.PORT || 4433;
const path = require("path");

mongodb()
  .then(() => {
    console.clear();
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.get("/_/*", (req, res) => {
      res.sendFile(__dirname + "/src/admin/src/index.html");
    });
    app.use("/api", Api_Router);

    app.listen(PORT, () => {
      Novabase.init({
        app,
        PORT,
      });
    });
  })
  .catch((err) => {
    new Error(err);
  });
