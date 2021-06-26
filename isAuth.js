const jwt = require('jsonwebtoken')
module.exports = function (token) {
  console.log('ON GOING')

  if (!token) {
    return 401
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    console.log(verified._id)
    return verified
  } catch (error) {
    console.log(error)
    return 401
  }
}
