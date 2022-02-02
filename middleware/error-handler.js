const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //set default
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Что-то пошло не так, попробуйте позже'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name ==='ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode = 400
  }

  if (err.code && err.code===11000){
    customError.msg = `В поле ${Object.keys(err.keyValue)} введено повторяющееся значение. Выберите другое значение.`
    customError.statusCode = 400
  }

  if(err.name === 'CastError'){
    customError.msg = `Не найден элемент с идентификатором: ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
