const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(_.pick(user, ["name", "isAdmin", "email"]));
});

router.get("/", auth, async (req, res) => {
  const users = await User.find().select("-password");
  res.send(_.pick(users, ["name", "isAdmin", "email"]));
});

router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name", "isAdmin", "email"]));
});

router.post("/", auth, admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ name: req.body.name });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "password", "email"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "isAdmin"]));
});

router.put("/:id", auth, admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "isAdmin", "email"]));
});

router.delete("/:id", auth, admin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name", "isAdmin", "email"]));
});

module.exports = router;
