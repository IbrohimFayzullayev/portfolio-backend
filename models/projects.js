const Joi = require("joi");
const mongoose = require("mongoose");

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["paused", "completed", "ongoing"],
    },
    tools: {
      type: String,
      required: true,
    },
  })
);
function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    description: Joi.string().required(),
    status: Joi.string().valid("paused", "completed", "ongoing").required(),
    tools: Joi.string().required(),
  });

  return schema.validate(project);
}

exports.Project = Project;
exports.validate = validateProject;
