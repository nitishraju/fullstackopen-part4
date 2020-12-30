const listhelper = require('../utils/dummies/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listhelper.dummy(blogs)
  expect(result).toBe(1)
})