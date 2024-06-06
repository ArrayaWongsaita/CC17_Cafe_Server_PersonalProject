const createError = require("../utils/create-error")

const isAdmin = (req, res, next) => {
  try {
    if(req.user.isAdmin === false){
      createError({
        message: 'this id is not Admin',
         statusCode: 403
      })
    }
    next()
    
  } catch (error) {
    next(error)
  }
}

module.exports = isAdmin