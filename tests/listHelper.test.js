const listhelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listhelper.dummy(blogs)
  expect(result).toBe(1)
})