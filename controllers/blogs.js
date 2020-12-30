const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response, next) => {
  const emptyValExists = [
    request.body.title,
    request.body.author,
    request.body.url
  ].some(value => value === undefined)

  if (emptyValExists) {
    return response.status(400).json({
      error: 'title, author, or url has not been provided'
    })
  }
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter