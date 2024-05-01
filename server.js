const express = require("express");
const mongoose = require("mongoose");
const projects = require("./routes/projects");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/portfolio")
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.error("Error connecting to MongoDB...."));

app.use(express.json());
app.use("/api/projects", projects);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
