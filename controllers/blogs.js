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
  let blogToCreate = request.body
  const emptyValExists = [
    blogToCreate.title,
    blogToCreate.url
  ].some(value => value === undefined)

  if (emptyValExists) {
    return response.status(400).json({
      error: 'title or url has not been provided'
    })
  }

  if (blogToCreate.likes === undefined) {
    blogToCreate.likes = 0
  }
  const blog = new Blog(blogToCreate)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter