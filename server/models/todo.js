import mongoose from 'mongoose'

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedOn: {
    type: Number,
    default: null
  }
})

export default Todo
