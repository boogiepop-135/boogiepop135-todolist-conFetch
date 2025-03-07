import React, { useEffect, useState } from "react";

const API_URL_BASE = "https://playground.4geeks.com/todo";

function Home() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await fetch(`${API_URL_BASE}/users/ejemplo`);
      const data = await res.json();
      setTodos(data.todos);
    } catch (error) {
      console.log("Error al obtener tareas", error);
    }
  };

  const createTodo = async () => {
    if (inputValue.trim() === "") return;

    try {
      await fetch(`${API_URL_BASE}/todos/ejemplo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: inputValue, is_done: false }),
      });

      setInputValue("");
      getTodos();
    } catch (error) {
      console.log("Error al crear tarea", error);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      await fetch(`${API_URL_BASE}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, is_done: !todo.is_done }),
      });

      getTodos();
    } catch (error) {
      console.log("Error al actualizar tarea", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL_BASE}/todos/${id}`, { method: "DELETE" });
      getTodos();
    } catch (error) {
      console.log("Error al eliminar tarea", error);
    }
  };

  const updateTodo = async (id) => {
    if (editInput.trim() === "") return;

    try {
      await fetch(`${API_URL_BASE}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: editInput }),
      });

      setEditingTodo(null);
      setEditInput("");
      getTodos();
    } catch (error) {
      console.log("Error al editar tarea", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Lista de tareas</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTodo()}
          placeholder="Nueva tarea..."
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={createTodo}
          style={{
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            background: "#28a745",
            color: "white",
            cursor: "pointer",
          }}
        >
          Agregar
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: "0", width: "400px", margin: "0 auto" }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              checked={todo.is_done}
              onChange={() => toggleTodo(todo)}
            />

            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateTodo(todo.id)}
                style={{
                  padding: "5px",
                  width: "60%",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <span
                style={{
                  textDecoration: todo.is_done ? "line-through" : "none",
                  flexGrow: 1,
                  textAlign: "left",
                  marginLeft: "10px",
                }}
              >
                {todo.label}
              </span>
            )}

            {editingTodo === todo.id ? (
              <button
                onClick={() => updateTodo(todo.id)}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Guardar
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingTodo(todo.id);
                  setEditInput(todo.label);
                }}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#ffc107",
                  cursor: "pointer",
                }}
              >
                Editar
              </button>
            )}

            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "none",
                background: "#dc3545",
                color: "white",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
