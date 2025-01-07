const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors  = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const Message = require("./model/Message");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

mongoose.connect("mongodb+srv://praiseadebayo:w37vylIYpfkcuFsz@cluster0.exhgv.mongodb.net/",)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

  // const messageSchema = new mongoose.Schema({
  //   title: String,
  //   content: String,
  //   completed: Boolean,
  // }); 

  // const Message = mongoose.model("userstodo", messageSchema);
  
// Simulated database
const dbPath = path.join(__dirname, "data", "todos.json");

// Helper function to read/write the database
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
 const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Routes

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Message.find();
    console.log('Fetched todos:', todos);
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: "failed to fetch" })
  }
  // const todos = readDB();
  // res.json(todos);
});

// Create a new todo
app.post("/todos", async (req, res) => {
  const { title, content, completed = false } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  // const todos = readDB();
  // const newTodo = { id: Date.now(), title, content, completed };
  // todos.push(newTodo);
  // writeDB(todos);
  // res.status(201).json(newTodo);
  try {
    const newTodo = new Message({
      title,
      content,
      completed
    });
    const savedTodo = await newTodo.save();
    console.log('Saved todo:', savedTodo); // Debugging line
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error('Error creating todo:', err); // Debugging line
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Update a todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, completed } = req.body;
  try {
    const todo = await Message.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    if (title !== undefined) todo.title = title;
    if (content !== undefined) todo.content = content;
    if (completed !== undefined) todo.completed = completed;
    const updatedTodo = await todo.save();
    console.log('Updated todo:', updatedTodo); // Debugging line
    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err); // Debugging line
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Message.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    await todo.remove();
    console.log('Deleted todo:', todo); // Debugging line
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err); // Debugging line
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


