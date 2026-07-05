const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const pool = require("../config/db");
// SIGNUP ROUTE
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/signup",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.createUser(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    res.json({
      message: "User created successfully",
      user: newUser,
    });
  }
);
router.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    res.json({
      message: "Logged in successfully",
      user: req.user,
    });
  }
);
router.post("/join", async (req, res) => {
  const { code } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  if (code !== "club123") {
    return res.status(400).json({ message: "Wrong code" });
  }

  await pool.query(
    "UPDATE users SET is_member = TRUE WHERE id = $1",
    [req.user.id]
  );

  res.json({ message: "You are now a member!" });
});
module.exports = router;