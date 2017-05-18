import express from 'express'
import bodyParser from 'body-parser'
import { mongoose } from './db/mongoose'
import Todo from './models/todo'
import _ from 'lodash'
import User from './models/users'
import { ObjectID } from 'mongodb'

const env = process.env.NODE_ENV || 'development'
console.log('***********', env)

if (env === 'development') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/mohit-todo'
} else if (env === 'test') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/mohit-todo-test'
}

const app = express()
const port = process.env.PORT
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// CREATE ROUTE
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })
  todo.save().then(data => res.send(data), err => res.status(400).send(err))
})

// READ ROUTE
app.get('/todos', (req, res) => {
  Todo.find().then(
    todos => {
      res.send({
        todos
      })
    },
    err => {
      res.status(400).send(err)
    }
  )
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    res.status(404).send()
  }
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(err => res.status(404).send(err))
})

// DELETE ROUTE
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    res.status(404).send()
  }
  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(err => res.status(400).send(err))
})

// UPDATE ROUTE
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ['text', 'completed'])
  if (!ObjectID.isValid(id)) {
    res.status(404).send()
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedOn = new Date().getTime()
  } else {
    body.completedOn = null
    body.completed = false
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(e => res.status(400).send())
})

// POST User
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  const user = new User(body)
  user.save().then(() => user.generateAuthToken()).then(token => {
    res.header('x-auth', token).send(user)
  })
})

app.listen(port, () => {
  console.log(`App is running on ${port}`)
})

export default app
