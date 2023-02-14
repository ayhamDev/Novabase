const express = require("express");
const { clear } = require("console");
const { watch } = require("fs");
const ip = require("ip");
const localtunnel = require("localtunnel");
const open = require("open");
const path = require("path");
const app = express();

app.use("/static", express.static(path.join(__dirname, "/src/static")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/index.html"));
});

app.listen(4000, () => {
  console.log(`Your App is Running on:
                - Localy:  http://localhost:4000
                - Network: http://${ip.address()}:4000`);
  if (process.argv[2] == "--dev") {
    open("http://localhost:4000");
    localtunnel({ port: 4000 })
      .then((tunnel) => {
        console.log(`Online Preview : ${tunnel.url}`);
        open(tunnel.url);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
