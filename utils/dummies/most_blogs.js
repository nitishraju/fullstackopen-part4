const _ = require('lodash')
const getMostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return []
  }

  const authorWithMostBlogs = _.countBy(blogs, 'author')
  let toPair =  Object.entries(authorWithMostBlogs)
  toPair = _.reverse(toPair)

  const formattedObj = {
    author: toPair[0][0],
    blogs: toPair[0][1]
  }
  return formattedObj
}

module.exports = { getMostBlogs }