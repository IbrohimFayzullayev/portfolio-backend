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
  if (!user)
    return res.status(400).send({
      message: "Invalid name or password.",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      message: "Invalid name or password.",
    });

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send({
    user: _.pick(user, ["_id", "name", "email", "isAdmin"]),
    token: token,
  });
});

function validate(req) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
