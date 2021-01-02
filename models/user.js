const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: String,
  passwordHash: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
  }
})
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)