const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ name: req.body.name });
  if (!user) return res.status(400).send("Invalid name or password.");

  const validaPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validaPassword) return res.status(400).send("Invalid name or password.");

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["name", "email", "isAdmin"]));
});

function validate(req) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
