const getTotalLikes = (blogs) => {
  let totalLikes = 0
  blogs.forEach(element => {
    totalLikes += element.likes
  })

  return totalLikes
}

module.exports = { getTotalLikes }