const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/',  async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
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

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter