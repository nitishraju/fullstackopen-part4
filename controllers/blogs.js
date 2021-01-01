const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/',  async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  let blogToCreate = request.body

  if (blogToCreate.title === undefined || blogToCreate.url === undefined) {
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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const reqBody = request.body
  const updatedBlog = {
    title: reqBody.title,
    author: reqBody.author,
    url: reqBody.url,
    likes: reqBody.likes
  }

  const updateOpts = { new: true, runValidators: true, context: 'query' }
  const putResponse =
    await Blog.findByIdAndUpdate(request.params.id, updatedBlog, updateOpts)

  if (putResponse) {
    response.json(putResponse)
  }
  else {
    response.status(404).end()
  }
})

module.exports = blogsRouter