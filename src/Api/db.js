const express = require("express");
const { default: mongoose } = require("mongoose");
const GetQuary = require("../utils/quary");
const router = express.Router();
const { readdir } = require("fs");
const Novabase = require("../utils/Novabase");
const { collection } = require("../model/blog");
const conn = mongoose.connection;

/**
 * @api {GET} /api/db/ Get All Collections
 * @apiName Get All Collections
 * @apiGroup Database
 *
 */
router.get("/", async (req, res) => {
  readdir("./src/model", async (err, files) => {
    const models = files.map((value, index) => value.replace(/\.js/g, ""));
    res.json([...models]);
  });
});

/** Collection */
/**
 * @api {GET} /api/db/:collection Get All Docments in Collection
 * @apiName Get Documents
 * @apiGroup Database
 *
 *  @apiParam {String} collection The Model Name From The File
 */
router.get("/:collection", Novabase.db.Rules, async (req, res) => {
  if (req.params.collection.includes("@"))
    return res.status(401).json({
      error: {
        status: 401,
        type: "permission",
        msg: "Access Denied",
        details: "Cant Access Novabase Collections",
      },
    });

  readdir("./src/model", async (err, files) => {
    const models = files.map((value, index) => value.replace(/\.js/g, ""));
    const ModelName = models.find((model) => model == req.params.collection);
    if (!ModelName)
      return res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Collection = require(`../model/${ModelName}.js`);
    if (!Collection)
      res.status(500).json({
        error: {
          status: 500,
          type: "Server Error",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    req.query.sort = req.query.sort || `{"updatedAt": "desc" }`;
    res.json(
      await Collection.find()
        .limit(parseInt(req.query.limit) || 0)
        .skip(parseInt(req.query.skip) || 0)
        .sort({ ...JSON.parse(req.query.sort) })
    );
  });
});
/**
 * @api {POST} /api/db/:collection Add New Document
 * @apiName addDocument
 * @apiGroup Database
 *
 *  @apiParam {String} collection The Model Name From The File
 *
 */
router.post("/:collection", (req, res) => {
  if (req.params.collection.includes("@"))
    return res.status(404).json({
      error: {
        status: 404,
        type: "permission",
        msg: "Access Denied",
        details: "Cant Access Novabase Collections",
      },
    });

  readdir("./src/model", async (err, files) => {
    const models = files.map((value, index) => value.replace(/\.js/g, ""));
    const ModelName = models.find((model) => model == req.params.collection);
    if (!ModelName)
      return res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Collection = require(`../model/${ModelName}.js`);
    if (!Collection)
      res.status(500).json({
        error: {
          status: 500,
          type: "Server Error",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });

    const Doc = new Collection({ ...req.body });
    Doc.save()
      .then(() => {
        res.status(201).json(Doc);
      })
      .catch(() => {
        res.status(500).json({
          error: {
            status: 500,
            type: "Server Error",
            msg: "Could Not Add The Doucment To The Collection.",
            details:
              "Collection name is incorrect or The Collection is undefind",
          },
        });
      });
  });
});

/**
 * @api {DELETE} /api/db/:collection Delete All Documents
 * @apiName deleteDouments
 * @apiGroup Database
 *
 *  @apiParam {String} collection The Model Name From The File
 *
 */
router.delete("/:collection", (req, res) => {
  if (req.params.collection.includes("@"))
    return res.status(404).json({
      error: {
        status: 404,
        type: "permission",
        msg: "Access Denied",
        details: "Cant Access Novabase Collections",
      },
    });

  readdir("./src/model", async (err, files) => {
    const models = files.map((value, index) => value.replace(/\.js/g, ""));
    const ModelName = models.find((model) => model == req.params.collection);
    if (!ModelName)
      return res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Collection = require(`../model/${ModelName}.js`);
    if (!Collection)
      res.status(500).json({
        error: {
          status: 500,
          type: "Server Error",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Resluts = await Collection.deleteMany();
    res.status(201).json(Resluts);
  });
});

/** Collection/doc */
/**
 * @api {GET} /api/db/:collection/:doc get a Document
 * @apiName getDocument
 * @apiGroup Database
 *
 *  @apiParam {String} collection The Model Name From The File
 *  @apiParam {String} doc The ID of the document
 *
 */
router.get("/:collection/:doc", (req, res) => {
  readdir("./src/model", async (err, files) => {
    const models = files.map((value, index) => value.replace(/\.js/g, ""));
    const ModelName = models.find((model) => model == req.params.collection);
    if (!ModelName)
      return res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Collection = require(`../model/${ModelName}.js`);
    if (!Collection)
      res.status(500).json({
        error: {
          status: 500,
          type: "Server Error",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    try {
      const Doc = await Collection.findById(req.params.doc);
      if (!Doc)
        return res.status(404).json({
          error: {
            status: 404,
            type: "undefind",
            msg: "Could Not Find The Document.",
            details:
              "Collection name is incorrect or The Collection is undefind",
          },
        });
      res.json(Doc);
    } catch (err) {
      res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Document.",
          details: err,
        },
      });
    }
  });
});

/**
 * @api {PATCH} /api/db/:collection/:doc update a Document
 * @apiName updateDocument
 * @apiGroup Database
 *
 *  @apiParam {String} collection The Model Name From The File
 *  @apiParam {String} doc The ID of the document
 *
 */

router.patch("/:collection/:doc", async (req, res) => {
  readdir("./src/model", async (err, files) => {
    const models = files.map((value, index) => value.replace(/\.js/g, ""));
    const ModelName = models.find((model) => model == req.params.collection);
    if (!ModelName)
      return res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Collection = require(`../model/${ModelName}.js`);
    if (!Collection)
      res.status(500).json({
        error: {
          status: 500,
          type: "Server Error",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Doc = await Collection.findById(req.params.doc);
    if (!Doc)
      return res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Document.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Data = req.body;
    let fail = false;
    for (const key in Data) {
      if (!fail) {
        if (Object.hasOwnProperty.call(Data, key)) {
          if (!Doc[key]) {
            fail = true;
          }
          if (!fail) {
            Doc[key] = Data[key];
          }
        }
      }
    }
    if (fail)
      return res.status(401).json({
        error: {
          status: 401,
          type: "Schema Error",
          msg: "Cant Set new fields on The document",
          details: "Schema is incorrect",
        },
      });
    else {
      Doc.save()
        .then(() => {
          res.status(201).json(Doc);
        })
        .catch(() => {
          res.status(500).json({
            error: {
              status: 500,
              type: "Server Error",
              msg: "Could Not Update The Doucment To The Collection.",
              details:
                "Collection name is incorrect or The Collection is undefind",
            },
          });
        });
    }
  });
});

/**
 * @api {DELETE} /api/db/:collection/:doc Delete a document
 * @apiName deleteDocument
 * @apiGroup Database
 *
 *  @apiParam {String} collection The Model Name From The File
 *  @apiParam {String} doc The ID of the document
 *
 */

router.delete("/:collection/:doc", (req, res) => {
  readdir("./src/model", async (err, files) => {
    const models = files.map((value, index) => value.replace(/\.js/g, ""));
    const ModelName = models.find((model) => model == req.params.collection);
    if (!ModelName)
      return res.status(404).json({
        error: {
          status: 404,
          type: "undefind",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Collection = require(`../model/${ModelName}.js`);
    if (!Collection)
      res.status(500).json({
        error: {
          status: 500,
          type: "Server Error",
          msg: "Could Not Find The Collection.",
          details: "Collection name is incorrect or The Collection is undefind",
        },
      });
    const Doc = await Collection.findByIdAndDelete(req.params.doc);
    res.json(Doc);
  });
});

/** POST - Collection/doc */
module.exports = router;
