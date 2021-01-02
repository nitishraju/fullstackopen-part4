const logger = require('./logger')
const morgan = require('morgan')

morgan.token('post-data', (request) => {
  return JSON.stringify(request.body)
})

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  const token = authorization && authorization.toLowerCase().startsWith('bearer ')
    ? authorization.substring(7)
    : null

  request.token = token
  next()
}

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
  } else
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid or missing token'
    })
  }

  next(error)
}

module.exports = { morgan, tokenExtractor, unknownEndpoint, errorHandler }