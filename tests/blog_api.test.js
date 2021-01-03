const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const testUser = {
  'username': 'testuserBlog',
  'name': 'Test User',
  'password': 'Tuser'
}
let token = null

beforeAll(async () => {
  await api
    .post('/api/users')
    .send(testUser)
    .expect(200)

  const response = await api.post('/api/login')
    .send(testUser)
    .expect(200)

  token = response.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})

  let newBlog = new Blog(initialBlogs[0])
  await newBlog.save()
  newBlog = new Blog(initialBlogs[1])
  await newBlog.save()
})

test('creating a blog fails if the header does not contain a token', async () => {
  const validTestBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(validTestBlog)
    .expect(401)
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
    .auth(token, { type: 'bearer' })
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
    .auth(token, { type: 'bearer' })
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
    .auth(token, { type: 'bearer' })
    .send(testBlogWithoutTitle)
    .expect(400)

  const testBlogWithoutUrl = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .auth(token, { type: 'bearer' })
    .send(testBlogWithoutUrl)
    .expect(400)
})

test('a blog that is deleted is not found in the database', async () => {
  const blogToDelete = {
    title: 'Blog that is going to be deleted',
    author: 'To Be Deleted',
    url: 'http://toBeDeleted.com/',
    likes: 0
  }

  const postResponse = await api
    .post('/api/blogs')
    .auth(token, { type: 'bearer' })
    .send(blogToDelete)
    .expect(201)

  const idToDelete = postResponse.body.id
  await api
    .delete(`/api/blogs/${idToDelete}`)
    .auth(token, { type: 'bearer' })
    .expect(204)

  const response = await api.get('/api/blogs')
  const blogList = response.body.map(blogObject => blogObject.title)
  expect(blogList).not.toContain('Blog that is going to be deleted')
})

test('a blog that is updated contains the new data', async () => {
  const blogToUpdate = {
    title: 'Blog that is going to be updated',
    author: 'To Be Updated',
    url: 'http://toBeUpdated.com/',
    likes: 0
  }

  const postResponse = await api
    .post('/api/blogs')
    .auth(token, { type: 'bearer' })
    .send(blogToUpdate)
    .expect(201)

  const idToUpdate = postResponse.body.id
  const updatedBlog = {
    title: 'Blog that has been updated',
    author: 'Updated Blog',
    url: 'http://updatedBlog.com/',
    likes: 25
  }

  const putResponse = await api
    .put(`/api/blogs/${idToUpdate}`)
    .auth(token, { type: 'bearer' })
    .send(updatedBlog)
    .expect(200)

  const finalBlog = putResponse.body
  expect(finalBlog.likes).toBe(25)
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})