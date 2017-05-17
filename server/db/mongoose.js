import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/mohit-todo'
mongoose.connect(db)

module.exports = { mongoose }
