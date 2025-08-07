import { useEffect, useState } from 'react';
import './App.css';
  const BACKEND_URL = 'http://localhost:15000/tasks'

function TodoCard({ todo, refesh}) {

  // const [cardCompleted, setCardCompleted] = useState(todo.completed)

  const handleChangeCheckbox = (e) => {
    // setCardCompleted(e.target.checked)
    fetch(BACKEND_URL+`/${todo._id}`, {
      method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: e.target.checked
        })
    })
    .finally(() => {
      refesh()
    })
  }
  return (
    <li>
      - {todo.text} {todo.completed ? 'Completed': 'Not Completed'} <input type='checkbox' checked={todo.completed}  onChange={handleChangeCheckbox}/>
    </li>
  )
}

function App() {

  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState('')

  const handleChangeInput = (e) => {
    setTodoInput(e.target.value)
  }

  const fetchTodo = async() => {
    try {

      fetch(BACKEND_URL).then(async(res) => {
        const data = await res.json()
        // console.log(data)
        setTodos(data)        
      })

    } catch (error) {
      console.log(error)
    }
  }

  const addTodo = async(e) => {
    e.preventDefault()
    console.log(e.target.elements.taskName.value)
      fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: e.target.elements.taskName.value,
          completed: false
        })
      })
      .catch((err) => {
        alert(err.message)
      })
      .finally(() => {
        fetchTodo()
      })

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
          <input name='taskName' placeholder='Name of Task' value={todoInput} onChange={handleChangeInput}/>
          <button type='submit'>
            Submit
          </button>          
        </form>
      </div>
      {todos.length > 0 && (
        <ul>
          {todos.map((todo, index) => (
            <TodoCard todo={todo} refesh={fetchTodo} />
          ))}
        </ul>        
      )}

    </div>
  );
}

export default App;
