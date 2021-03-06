const config = require('./utils/config')
const logger = require('./utils/logger')
require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const connectionOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
mongoose.connect(config.MONGO_URI, connectionOpts)
  .then(() => {
    logger.info('Connected to MongoDB successfully!')
  })
  .catch(error => {
    logger.error('Unable to connect to MongoDB! Error:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms - Body: :post-data', {
  skip: (request) => ['GET'].includes(request.method) || process.env.NODE_ENV === 'test'
}))
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
if (process.env.NODE_ENV === 'test') {
  const resetRouter = require('./controllers/reset')
  app.use('/api/testing', resetRouter)
}

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app