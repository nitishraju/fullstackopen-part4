const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const reqBody = request.body

  const user = await User.findOne({ username: reqBody.username })
  const correctDetails = user === null
    ? false
    : await bcrypt.compare(reqBody.password, user.passwordHash)

  if (! (user && correctDetails)) {
    return response.status(401).json({
      error: 'username or password is invalid'
    })
  }

  const userNeedingToken = {
    username: reqBody.username,
    id: user._id
  }

  const token = jwt.sign(userNeedingToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter