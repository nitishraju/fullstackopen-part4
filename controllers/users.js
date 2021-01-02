const usersRouter = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  let userToCreate = request.body
  if (userToCreate.password === undefined) {
    return response.status(400).json({
      error: 'password value was not provided'
    })
  } else
  if (userToCreate.password.length < 3) {
    return response.status(400).json({
      error: 'password length must be greater than 3 characters'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(userToCreate.password, saltRounds)

  const user = new User({
    username: userToCreate.username,
    name: userToCreate.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter