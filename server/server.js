import express from 'express'
import bodyParser from 'body-parser'
import { mongoose } from './db/mongoose'
import Todo from './models/todo'
import User from './models/users'

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })
  todo.save().then(data => res.send(data), err => res.status(400).send(err))
})

app.listen(port, () => {
  console.log(`App is running on ${port}`)
})

export default app
