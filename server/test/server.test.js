import expect from 'expect'
import request from 'supertest'
import chalk from 'chalk'
import { ObjectID } from 'mongodb'
import app from '../server'
import Todo from '../models/todo'

console.log(chalk.green('Wiping the database before running the test'))

const todos = [
  {
    _id: new ObjectID(),
    text: 'First Test Todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second Text Todo',
    completed: true,
    completedOn: 123456
  }
]

beforeEach(done => {
  Todo.remove({})
    .then(data => {
      Todo.insertMany(todos)
    })
    .then(() => done())
})

console.log(chalk.blue('Running Tests'))

describe('POST /todos', () => {
  it('Should create a new todo', done => {
    const text = 'Test todo text'

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          })
          .catch(e => done(e))
      })
  })
  it('Should not create todo with invalid body data', done => {
    request(app).post('/todos').send({}).expect(400).end((err, res) => {
      if (err) {
        return done(err)
      }
      Todo.find()
        .then(todos => {
          expect(todos.length).toBe(2)
          done()
        })
        .catch(err => done(err))
    })
  })
})
describe('GET /todos 😄', () => {
  it('Should show all the todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('Should return the todo Object', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('Should return 404 if todo not found', done => {
    const hexID = new ObjectID().toHexString()
    request(app).get(`/todos/${hexID}`).expect(404).end(done)
  })
  it("Should return a 404 back for non object ID's", done => {
    request(app).get(`/todos/123`).expect(404).end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('Should delete the todo object', done => {
    const hexID = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexID)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexID)
          .then(todo => {
            expect(todo).toNotExist()
            done()
          })
          .catch(e => done(e))
      })
  })
  it('Should return 404 if todo not found', done => {
    const hexID = new ObjectID().toHexString()
    request(app).delete(`/todos/${hexID}`).expect(404).end(done)
  })
  it("Should return a 404 back for non object ID's", done => {
    request(app).delete(`/todos/123`).expect(404).end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('Should update the todo', done => {
    const hexID = todos[0]._id.toHexString()
    const text = 'Hello from Supertest'
    request(app)
      .patch(`/todos/${hexID}`)
      .send({ text, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completedOn).toBeA('number')
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.text).toBe(text)
      })
      .end(done)
  })
  it('Should clear completedAt when todo is not completed 😝', done => {
    const hexID = todos[0]._id.toHexString()
    const text = 'Hello from Supertest'
    request(app)
      .patch(`/todos/${hexID}`)
      .send({ text, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completedOn).toNotExist()
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.text).toBe(text)
      })
      .end(done)
  })
})
