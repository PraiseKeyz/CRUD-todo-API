const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulated database
const dbPath = path.join(__dirname, "data", "todos.json");

// Helper function to read/write the database
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Routes

// Get all todos
app.get("/todos", (req, res) => {
  const todos = readDB();
  res.json(todos);
});

// Create a new todo
app.post("/todos", (req, res) => {
  const { title, completed = false } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const todos = readDB();
  const newTodo = { id: Date.now(), title, completed };
  todos.push(newTodo);
  writeDB(todos);
  res.status(201).json(newTodo);
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todos = readDB();
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  writeDB(todos);
  res.json(todo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todos = readDB();
  const updatedTodos = todos.filter((t) => t.id !== parseInt(id));
  if (todos.length === updatedTodos.length) {
    return res.status(404).json({ error: "Todo not found" });
  }
  writeDB(updatedTodos);
  res.status(204).send(); // No content
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
