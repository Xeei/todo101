import { useCallback, useEffect, useState } from 'react';
import './App.css';
import {motion} from 'motion/react'
const BACKEND_URL = 'http://localhost:15000/tasks'

function TodoCard({ todo, refesh, delay=0 }) {

  const [deleting, setDeleting] = useState(false)

  const handleChangeCheckbox = (e) => {
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

  const handleDeleteTaskButton = async() => {
    if(window.confirm(`Do you want to Delete ${todo.text}`)){
      try {
        setDeleting(true)
        await fetch(BACKEND_URL+`/${todo._id}`, {
          method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
        })
      } catch (error) {
        alert('Opps, Something went wrong')
      } finally {
        setDeleting(false)
        refesh()   
      }

        
    }
  }
  return (
    <motion.tr 
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1
    }}
    transition={{
      duration: 0.5,
      delay: delay
    }}
    >
      <td align='center'>
        <input type='checkbox' checked={todo.completed}  onChange={handleChangeCheckbox}/>
      </td>
      <td>
        {todo.text}
      </td>
      <td align='center'>
          <button title='Delete Task' onClick={handleDeleteTaskButton}>
            {deleting? 'Deleting...' : '🗑️'}
          </button>
      </td>
    </motion.tr>
    // <li>
    //   - {todo.text} {todo.completed ? 'Completed': 'Not Completed'} <input type='checkbox' checked={todo.completed}  onChange={handleChangeCheckbox}/>
    // </li>
  )
}

function App() {

  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState('')

  const handleChangeInput = (e) => {
    setTodoInput(e.target.value)
  }

  const fetchTodo = useCallback(async () => {
    try {

      fetch(BACKEND_URL).then(async(res) => {
        const data = await res.json()
        // console.log(data)
        setTodos(data)        
      })

    } catch (error) {
      console.log(error)
    }
  }, []);

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
        setTodoInput('')
        fetchTodo()
      })

  }

  useEffect(() => {
    fetchTodo()
  }, [fetchTodo])
  return (
    <div style={{ padding: '10px'}}>
      <h1>
        Todo App v1.0.0
      </h1>
      <div style={{ display: 'flex'}}>
        <form onSubmit={addTodo}>
          <input name='taskName' placeholder='Name Task Here' value={todoInput} onChange={handleChangeInput} style={{ marginRight: '10px'}}/>
          <button type='submit'>
            Submit
          </button>          
        </form>
      </div>
      <div style={{paddingTop: '10px'}}>
    {todos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Completed</th>
              <th>Task</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {todos.map((todo, index) => (
                <TodoCard todo={todo} refesh={fetchTodo} key={todo._id} delay={index*0.01}/>
              ))}  
          </tbody>
        </table>        
      ): (
        <div>
          No Task For Now
        </div>
      )}        
      </div>
  



    </div>
  );
}

export default App;
