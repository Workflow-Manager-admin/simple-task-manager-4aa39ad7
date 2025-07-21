import React, { useEffect, useState } from "react";
import "./App.css";
import { getSupabaseClient } from "./supabaseClient";

/**
 * PUBLIC_INTERFACE
 * Main App component - renders a minimal todo list with Supabase CRUD.
 */
function App() {
  // UI State
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [input, setInput] = useState("");
  const [editInput, setEditInput] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  // Supabase
  const supabase = getSupabaseClient();

  // Effect: Load all todos
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  // Switch theme (not essential for light only, but keeps toggle)
  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  async function fetchTodos() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      setError("Could not fetch todos.");
      setLoading(false);
      return;
    }
    setTodos(data);
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function addTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setCreating(true);
    setError("");
    const { error, data } = await supabase
      .from("todos")
      .insert({ content: input.trim(), completed: false })
      .select();
    if (error) {
      setError("Could not add todo.");
    } else {
      setTodos((t) => [...t, ...data]);
      setInput("");
    }
    setCreating(false);
  }

  // PUBLIC_INTERFACE
  async function deleteTodo(id) {
    setError("");
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) setError("Could not delete todo.");
    setTodos((t) => t.filter((todo) => todo.id !== id));
  }

  // PUBLIC_INTERFACE
  async function toggleComplete(todo) {
    setError("");
    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id);
    if (error) setError("Could not update todo.");
    setTodos((t) =>
      t.map((item) =>
        item.id === todo.id ? { ...item, completed: !todo.completed } : item
      )
    );
  }

  // PUBLIC_INTERFACE
  function startEditing(todo) {
    setEditingTodoId(todo.id);
    setEditInput(todo.content);
  }

  // PUBLIC_INTERFACE
  async function saveEdit(todo) {
    if (!editInput.trim()) return;
    setError("");
    const { error } = await supabase
      .from("todos")
      .update({ content: editInput.trim() })
      .eq("id", todo.id);
    if (error) setError("Could not update todo.");
    setTodos((t) =>
      t.map((item) =>
        item.id === todo.id ? { ...item, content: editInput.trim() } : item
      )
    );
    setEditingTodoId(null);
    setEditInput("");
  }

  // PUBLIC_INTERFACE
  function cancelEdit() {
    setEditingTodoId(null);
    setEditInput("");
  }

  // UI components
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ fontWeight: 700, fontSize: "2.1rem", marginBottom: 0 }}>
          📝 Simple Todo
        </h1>
        <p style={{ marginTop: 2, color: "#999", marginBottom: 18 }}>
          Minimal todo app using Supabase
        </p>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          style={{ position: "absolute", top: 22, right: 35 }}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <form onSubmit={addTodo} style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          <input
            type="text"
            placeholder="Add a new task"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={creating}
            style={{
              padding: "11px 15px",
              borderRadius: 7,
              border: "1.5px solid var(--border-color)",
              outline: "none",
              fontSize: 18,
              minWidth: 210,
              background: "#fff",
            }}
            aria-label="Todo input"
          />
          <button
            type="submit"
            disabled={creating || !input.trim()}
            style={{
              background: "var(--button-bg)",
              color: "var(--button-text)",
              border: "none",
              borderRadius: 7,
              fontWeight: 600,
              padding: "0 21px",
              fontSize: 18,
              minHeight: 42,
              cursor: "pointer",
              opacity: creating ? 0.7 : 1,
              transition: "all .18s"
            }}
          >
            {creating ? "Adding..." : "Add"}
          </button>
        </form>

        <section style={{ width: "100%", maxWidth: 410 }}>
          {loading && (
            <div style={{ padding: 20, fontSize: 16 }}>Loading...</div>
          )}

          {error && (
            <div style={{ color: "#d8000c", marginBottom: 8 }}>{error}</div>
          )}

          {!loading && todos.length === 0 && (
            <div
              style={{
                color: "#999",
                padding: 13,
                fontSize: 16,
                marginTop: 12,
              }}
            >
              No tasks yet!
            </div>
          )}

          <ul
            style={{
              padding: 0,
              listStyle: "none",
              width: "100%",
              margin: 0,
            }}
          >
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#fff",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: 7,
                  marginBottom: 10,
                  padding: "7px 8px 7px 15px",
                  boxShadow:
                    "0px 2px 5px rgba(130,130,140,0.03), 0 0.5px 0.5px #f7f7f7",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => toggleComplete(todo)}
                  style={{ width: 22, height: 22, cursor: "pointer" }}
                  aria-label={
                    todo.completed
                      ? "Mark as incomplete"
                      : "Mark as complete"
                  }
                />
                {editingTodoId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      style={{
                        flex: 1,
                        marginLeft: 13,
                        border: "1.5px solid var(--border-color)",
                        padding: "7px 11px",
                        borderRadius: 7,
                        fontSize: 17,
                      }}
                      aria-label="Edit todo"
                    />
                    <button
                      onClick={() => saveEdit(todo)}
                      style={{
                        marginLeft: 6,
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        padding: "0 13px",
                        minHeight: 33,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer"
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        marginLeft: 4,
                        background: "#eee",
                        color: "#444",
                        border: "none",
                        borderRadius: 7,
                        padding: "0 9px",
                        minHeight: 33,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        marginLeft: 13,
                        flex: 1,
                        fontSize: 18,
                        textDecoration: todo.completed ? "line-through" : "none",
                        color: todo.completed ? "#bbb" : "#222",
                        transition: "color 0.15s, text-decoration 0.15s",
                      }}
                    >
                      {todo.content}
                    </span>
                    <button
                      onClick={() => startEditing(todo)}
                      style={{
                        marginLeft: 5,
                        background: "#f6c026",
                        color: "#29241a",
                        border: "none",
                        borderRadius: 7,
                        padding: "0 12px",
                        minHeight: 33,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        marginLeft: 7,
                        background: "#ea4335",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        padding: "0 12px",
                        minHeight: 33,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer"
                      }}
                      aria-label="Delete"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      </header>
    </div>
  );
}

export default App;
