const express = require("express");
const mongoose = require("mongoose");
const projects = require("./routes/projects");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const cors = require("cors");
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/portfolio")
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.error("Error connecting to MongoDB...."));

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/projects", projects);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

require("./startup/prod")(app);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
