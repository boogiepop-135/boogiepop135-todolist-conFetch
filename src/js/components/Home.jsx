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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">Lista de tareas</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe una tarea..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTodo()}
            />
            <button className="btn btn-success" onClick={createTodo}>
              Agregar
            </button>
          </div>

          <ul className="list-group">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <input
                  type="checkbox"
                  checked={todo.is_done}
                  onChange={() => toggleTodo(todo)}
                />

                {editingTodo === todo.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && updateTodo(todo.id)}
                    style={{ width: "60%" }}
                  />
                ) : (
                  <span
                    className="flex-grow-1 ms-2"
                    style={{
                      textDecoration: todo.is_done ? "line-through" : "none",
                    }}
                  >
                    {todo.label}
                  </span>
                )}

                <div>
                  {editingTodo === todo.id ? (
                    <button className="btn btn-primary btn-sm me-2" onClick={() => updateTodo(todo.id)}>
                      Guardar
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditingTodo(todo.id);
                        setEditInput(todo.label);
                      }}
                    >
                      Editar
                    </button>
                  )}

                  <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(todo.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
