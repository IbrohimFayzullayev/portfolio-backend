const { Project, validate } = require("../models/projects");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});

router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project)
    return res.status(404).send("The project with the given ID was not found.");

  res.send(project);
});

router.post("/", auth, async (req, res) => {
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
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      tools: req.body.tools,
    },
    { new: true }
  );

  if (!project)
    return res.status(404).send("The project with the given ID was not found.");

  res.send(project);
});

router.delete("/:id", auth, async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project)
    return res.status(404).send("The project with the given ID was not found.");

  res.send(project);
});

module.exports = router;
