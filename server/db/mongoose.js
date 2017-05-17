import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const db =
  'mongodb://localhost:27017/mohit-todo' ||
  'mongodb://mohit:host@ds143151.mlab.com:43151/mohit-todo'
mongoose.connect(db)

module.exports = { mongoose }
