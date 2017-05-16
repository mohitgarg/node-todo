import expect from 'expect'
import request from 'supertest'
import chalk from 'chalk'

import app from '../server'
import Todo from '../models/todo'

console.log(chalk.green('Wiping the database before running the test'))

beforeEach(done => {
  Todo.remove({}).then(() => done())
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
        Todo.find()
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
          expect(todos.length).toBe(0)
          done()
        })
        .catch(err => done(err))
    })
  })
})
