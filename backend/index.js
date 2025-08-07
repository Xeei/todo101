const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/todos'

const app = express()
const PORT = 15000
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

const Task = mongoose.model('Task', new mongoose.Schema({ text: String, completed: Boolean}))

app.get('/tasks', async(req, res) => {
    const task = await Task.find()
    res.json(task)
})

app.post('/tasks', async(req, res) => {
    const task = await Task.create(req.body)
    res.json(task)
})

app.put('/tasks/:id', async(req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body)
    res.json(task)
})

app.delete('/tasks/:id', async(req, res) => {
    await Task.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
})

const connectionWithRetry = () => {
    console.log('Trying to connect to MongoDB...')
    mongoose.connect(mongoURL)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(PORT, () => {
            console.log(`Server listen on http://localhost:${PORT}`)
        })        
    })
    .catch((err) => {
        console.log('MongoDB connect error, Retry in 5s...', err.message )
        setTimeout(connectionWithRetry, 5000)
    })
}

connectionWithRetry()
