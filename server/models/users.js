import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
})

const User = mongoose.model('User', UserSchema)

UserSchema.methods.generateAuthToken = function () {
  const access = 'Auth'
  let token = jwt
    .sign({ _id: this._id.toHexString(), access }, 'iamawesome')
    .toString()
  this.tokens.push({ access, token })
  return this.save().then(() => token)
}
export default User
