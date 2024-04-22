const express = require("express");

const app = express();
app.use(express.json());

// In-memory data store
let todos = [
  { id: "1", title: "Learn JavaScript", completed: true },
  { id: "2", title: "Learn React", completed: false },
  { id: "3", title: "Build a React app", completed: false },
];

// Routes

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Get a single todo by ID
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json(todo);
});

// Create a new todo
app.post("/todos", (req, res) => {
  const { title, completed } = req.body;
  const todo = { id: Date.now().toString(), title, completed };
  todos.push(todo);
  res.status(201).json(todo);
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }
  todos[index] = { ...todos[index], title, completed };
  res.json(todos[index]);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }
  const deletedTodo = todos.splice(index, 1);
  res.json({ message: "Todo deleted", todo: deletedTodo });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
