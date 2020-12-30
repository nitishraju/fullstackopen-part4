const getFavoriteBlog = (blogs) => {
  let topBlog = null

  blogs.forEach(blog => {
    if (topBlog) {
      if (blog.likes > topBlog.likes) {
        topBlog = blog
      }
    }
    else {
      topBlog = blog
    }
  })

  if (topBlog) {
    delete topBlog._id
    delete topBlog.__v
    delete topBlog.url

    return topBlog
  }
  else {
    return []
  }
}

module.exports = { getFavoriteBlog }