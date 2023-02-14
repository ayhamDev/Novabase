const jwt = require("jsonwebtoken");

const Novabase = {
  async init({ public, PORT, app }) {
    console.log("> Your Backend Is Running On".yellow);
    console.log(
      `     -` + ` ADMIN CMS`.green + `: http://127.0.0.1:${PORT}/_/`
    );
    console.log(
      `     -` + ` REST API:`.green + `  http://127.0.0.1:${PORT}/api`
    );
    if (typeof public == "boolean") {
      if (public == false) {
        app.get("/", (req, res) => {
          return res.redirect("/api");
        });
      }
    }
  },
  auth: {
    IsAuthenticated(req) {
      return new Promise((reslove, reject) => {
        const User = require("../model/@User");
        let Bearer = false;
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          const token = req.headers.authorization.split(" ")[1];
          try {
            const isVaild = jwt.verify(token, process.env.TOKEN_SECRET);
            User.findById(isVaild.id)
              .then((user) => {
                req.user = user;
                Bearer = true;
                reslove(user);
              })
              .catch((err) => {
                req.user = null;
                Bearer = false;
                reslove(Bearer);
              });
          } catch {
            req.user = null;
            Bearer = false;
            reslove(Bearer);
          }
        } else {
          req.user = null;
          Bearer = false;
          reslove(Bearer);
        }
      });
    },
  },
  db: {
    Rules(req, res, next) {
      const Collection = req.params.collection;
      if (Collection) {
        try {
          const collectionRule = require(`../middleware/${Collection}.rule`);
          collectionRule(req, res, next);
        } catch {
          next();
        }
      }
    },
  },
};
if (process.argv[2] == "--model") {
  const { writeFileSync } = require("fs");
  writeFileSync(
    `./src/model/${process.argv[3]}.js`,
    `const { default: mongoose } = require("mongoose");
const Schema = new mongoose.Schema(
  {},
  { timestamps: true, collection: "${process.argv[3]}" }
);

module.exports = mongoose.model("${process.argv[3]}", Schema);

  `
  );
  writeFileSync(
    `./src/middleware/${process.argv[3]}.rule.js`,
    `module.exports = (req, res, next) => {
    next();
};
  `
  );
}
module.exports = Novabase;
