const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
beforeEach(async () => {
  await Blog.deleteMany({})

  let newBlog = new Blog(initialBlogs[0])
  await newBlog.save()
  newBlog = new Blog(initialBlogs[1])
  await newBlog.save()
})

test('blogs are returned in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs contain an \'id\' attribute', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blogObject => {
    expect(blogObject.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const validTestBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(validTestBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogContents = response.body.map(blogObject => blogObject.title)
  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(blogContents).toContain('Type wars')
})

test('blogs without a given likes value will be created with a default of 0', async () => {
  const testBlogWithoutLikes =  {
    title: 'Study of a triangular bottle',
    author: 'David Eppstein',
    url: 'https://11011110.github.io/blog/2020/11/27/study-triangular-bottle.html'
  }

  const response = await api
    .post('/api/blogs')
    .send(testBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('blogs without a title or url value will be rejected', async () => {
  const testBlogWithoutTitle = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(testBlogWithoutTitle)
    .expect(400)

  const testBlogWithoutUrl = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(testBlogWithoutUrl)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})