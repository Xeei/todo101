import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState('')
  const BACKEND_URL = 'http://localhost:15000/tasks'

  const handleChangeInput = (e) => {
    setTodoInput(e.target.value)
  }

  const fetchTodo = async() => {
    try {

      fetch(BACKEND_URL).then((data) => {
        setTodos(data.json())        
      })

    } catch (error) {
      console.log(error)
    }
  }

  const addTodo = async(e) => {

    console.log(e)
    // try {
    //   fetch(BACKEND_URL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json' // Indicate that you are sending JSON data
    //     },
    //     body: {}
    //   })
    // } catch (error) {
    //   alert(error.message)
    // }
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
        <form onSubmit={addTodo}>
          <input placeholder='Name of Task' value={todoInput} onChange={handleChangeInput}/>
          <button type='submit'>
            Submit
          </button>          
        </form>
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
