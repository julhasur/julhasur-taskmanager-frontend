import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");
  const [editingDescriptionText, setEditingDescriptionText] = useState("");

  const API_URL = "http://localhost:5000/taskmanager"; 

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  // Add a new todo
  const handleAddTodo = () => {
    if (todoInput.trim() === "" || descriptionInput.trim() === "") {
      alert("Title and Description cannot be empty!");
      return;
    }

    const newTodoItem = {
      title: todoInput,
      description: descriptionInput,
      completed: false,
    };

    axios
      .post(API_URL, newTodoItem)
      .then((response) => {
        setTodos([response.data, ...todos]);
        setTodoInput("");
        setDescriptionInput("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  // Delete a todo
  const handleDeleteTodo = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  // Toggle completion
  const handleToggleComplete = (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    axios
      .put(`${API_URL}/${id}`, { ...todoToUpdate, completed: !todoToUpdate.completed })
      .then((response) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? response.data : todo
          )
        );
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  // Start editing
  const handleEditStart = (id, title, description) => {
    setEditingTodoId(id);
    setEditingTodoText(title);
    setEditingDescriptionText(description);
  };

  // Save edited todo
  const handleSaveEdit = (id) => {
    if (editingTodoText.trim() === "" || editingDescriptionText.trim() === "") {
      alert("Updated title and description cannot be empty!");
      return;
    }

    axios
      .put(`${API_URL}/${id}`, { title: editingTodoText, description: editingDescriptionText })
      .then((response) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? response.data : todo
          )
        );
        setEditingTodoId(null);
        setEditingTodoText("");
        setEditingDescriptionText("");
      })
      .catch((error) => console.error("Error saving todo:", error));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="Add a new title"
          className="border rounded p-2"
        />
        <textarea
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          placeholder="Add a description"
          className="border rounded p-2"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="p-2 border rounded">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              {editingTodoId === todo.id ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editingTodoText}
                    onChange={(e) => setEditingTodoText(e.target.value)}
                    className="border rounded p-1 w-full mb-1"
                  />
                  <textarea
                    value={editingDescriptionText}
                    onChange={(e) => setEditingDescriptionText(e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <p className={`font-bold ${todo.completed ? "line-through" : ""}`}>{todo.title}</p>
                  <p className={`${todo.completed ? "line-through" : ""}`}>{todo.description}</p>
                </div>
              )}
              {editingTodoId === todo.id ? (
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEditStart(todo._id, todo.title, todo.description)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
