const { TestScheduler } = require('jest')
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

  const response = await User.find({})
  const usernames = response.body.map(userObject => userObject.username)
  expect(usernames).not.toContain('invalidUser')
})