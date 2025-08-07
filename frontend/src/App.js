import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState('')


  const handleChangeInput = (e) => {
    setTodoInput(e.target.value)
  }

  const fetchTodo = async() => {
    try {

      fetch('http://localhost:15000/tasks').then((data) => {
        setTodos(data.json())        
      })

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTodo()
  }, [])
  return (
    <div>
      <h1>
        Todo App
      </h1>
      <div style={{ display: 'flex'}}>
        <input placeholder='Name of Task' value={todoInput} onChange={handleChangeInput}/>
        <button>
          Submit
        </button>
      </div>
      {todos.length > 0 && (
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>
              - {todo.name} {todo?.completed ? 'Completed': 'Not Completed'}
            </li>
          ))}
        </ul>        
      )}

    </div>
  );
}

export default App;
