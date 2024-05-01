const { Project, validate } = require("../models/projects");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let project = new Project({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    tools: req.body.tools,
  });
  project = await project.save();

  res.send(project);
});

module.exports = router;
