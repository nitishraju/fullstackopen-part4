const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/',  async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { blogs: 0 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  const user = await User.findById(decodedToken.id)

  let blogToCreate = request.body
  blogToCreate.user = user._id

  if (blogToCreate.title === undefined || blogToCreate.url === undefined) {
    return response.status(400).json({
      error: 'title or url has not been provided'
    })
  }

  if (blogToCreate.likes === undefined) {
    blogToCreate.likes = 0
  }
  const blog = new Blog(blogToCreate)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id || (blog.user.toString() !== decodedToken.id)) {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  await Blog.findByIdAndDelete(blog.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id || (blog.user.toString() !== decodedToken.id)) {
    return response.status(401).json({ error: 'invalid token' })
  }

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

  putResponse
    ? response.json(putResponse)
    : response.status(404).end()
})

module.exports = blogsRouter