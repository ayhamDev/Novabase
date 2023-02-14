const express = require("express");
const User = require("../model/@User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/api");
});
/**
 * @api {POST} /api/auth/register Register New User
 * @apiName Register
 * @apiGroup Authentication
 *
 *  @apiBody {String} Email a Vaild Email
 *  @apiBody {String} Password a Strong Password
 */
router.post(
  "/register",
  body("email").isEmail(),
  body("password")
    .isStrongPassword({
      minLength: 6,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(
      "Password must be at least 6 Letters/number and contain Upper and lower case."
    ),
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { password, email } = req.body;
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        const newUser = new User({
          email,
          password: hashedPassword,
          data: { ...req.body.data },
        });
        newUser
          .save()
          .then(() => {
            const Access_Token = jwt.sign(
              { email, data: req.body.data, id: newUser.id },
              process.env.TOKEN_SECRET,
              { expiresIn: "3h" }
            );
            res.status(200).json({ access_token: Access_Token });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: {
                status: 500,
                type: "Server error",
                msg: "Couldn't Create The User",
                details: "Something Went Wrong when trying to Create The User.",
              },
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          error: {
            status: 500,
            type: "Server error",
            msg: "Couldn't Hash The Password",
            details: "Something Went Wrong when trying to Hash The Password",
          },
        });
      });
  }
);

/**
 * @api {POST} /api/auth/register Login User
 * @apiName Login
 * @apiGroup Authentication
 *
 *  @apiBody {String} Email a Vaild Email
 *  @apiBody {String} Password a Strong Password
 */
router.post(
  "/login",
  body("email").isEmail(),
  body("password")
    .isStrongPassword({
      minLength: 6,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(
      "Password must be at least 6 Letters/number and contain Upper and lower case."
    ),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, valid) => {
        if (err)
          return res.status(500).json({
            error: {
              status: 500,
              type: "Server error",
              msg: "Couldn't Compare the Password.",
              details: err,
            },
          });
        if (!valid)
          return res.status(401).json({
            error: {
              status: 400,
              type: "Password",
              msg: "Password is incorrect",
              details: "Password is incorrect",
            },
          });
        const Access_Token = jwt.sign(
          { email, data: req.body.data },
          process.env.TOKEN_SECRET,
          { expiresIn: "3h" }
        );
        res.status(200).json({ access_token: Access_Token });
      });
    }
  }
);

module.exports = router;
