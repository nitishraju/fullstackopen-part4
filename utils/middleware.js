const logger = require('./logger')
const morgan = require('morgan')

morgan.token('post-data', (request) => {
  return JSON.stringify(request.body)
})

const unknownEndpoint = (request, response) => {
  logger.info(request)
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { morgan, unknownEndpoint }