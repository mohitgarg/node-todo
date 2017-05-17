import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const db = 'mongodb://localhost:27017/mohit-todo'
mongoose.connect(db)

module.exports = { mongoose }
