const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const initialUsers = [
  {
    username: 'testUser1',
    name: 'Test User 1',
    password: 'testPassword01'
  },
  {
    username: 'testUser2',
    name: 'Test User 2',
    password: 'testPassword02'
  },
]

beforeEach(async () => {
  await User.deleteMany({})

  let newTestUser = new User(initialUsers[0])
  await newTestUser.save()
  newTestUser = new User(initialUsers[1])
  await newTestUser.save()
})

test('invalid user is not added to database', async () => {
  const invalidUser = {
    username: 'invalidUser',
    name: 'Invalid user'
  }

  await api
    .post('/api/users')
    .send(invalidUser)
    .expect(400)

  const response = await api.get('/api/users')
  const usernames = response.body.map(userObject => userObject.username)
  expect(usernames).not.toContain('invalidUser')
})

test('post operation with invalid user returns appropriate status/message', async () => {
  const noPasswordUser = {
    username: 'invalidUser',
    name: 'Invalid user'
  }

  const noPassResponse = await api
    .post('/api/users')
    .send(noPasswordUser)
    .expect(400)

  const shortPasswordUser = {
    username: 'shortPassUser',
    name: 'Short Password',
    password: '1'
  }

  const shortPassResponse = await api
    .post('/api/users')
    .send(shortPasswordUser)
    .expect(400)

  const shortNameUser = {
    username: 'sp',
    name: 'Short Username',
    password: 'ShortUsername1'
  }

  const shortNameResponse = await api
    .post('/api/users')
    .send(shortNameUser)
    .expect(400)

  expect(noPassResponse.body.error).toEqual('password value was not provided')
  expect(shortPassResponse.body.error).toEqual('password length must be greater than 3 characters')
  expect(shortNameResponse.body.error).toContain('User validation failed: username: Path `username`')
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})