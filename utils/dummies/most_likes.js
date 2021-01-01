const _ = require('lodash')

const getMostLikes = (blogs) => {
  if (blogs.length === 0) {
    return []
  }

  const groupedByAuthor = _.groupBy(blogs, (blog) => blog.author)

  const likesCounter = (postsArray) => {
    let likeCount = 0
    postsArray.forEach(post => {
      likeCount += post.likes
    })

    return likeCount
  }

  let maxAuthor = ''
  let likeCount = -1
  for (const [author, posts] of Object.entries(groupedByAuthor)) {
    if (likesCounter(posts) > likeCount) {
      maxAuthor = author
      likeCount = likesCounter(posts)
    }
  }

  return {
    author: maxAuthor,
    likes: likeCount
  }
}

module.exports = { getMostLikes }