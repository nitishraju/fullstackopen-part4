const logger = require('./logger')
const morgan = require('morgan')

morgan.token('post-data', (request) => {
  return JSON.stringify(request.body)
})

const unknownEndpoint = (request, response) => {
  logger.info(request)
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

module.exports = { morgan, unknownEndpoint, errorHandler }