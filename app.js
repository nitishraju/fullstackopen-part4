const config = require('./utils/config')
const logger = require('./utils/logger')
require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
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
  skip: (request) => request.method !== 'POST'
}))

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)

module.exports = app