const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    status:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "There is something wrong"
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }


  if(err.name == "CastError"){
    customError.status = StatusCodes.NOT_FOUND;
    customError.msg = `Please Provide valid job id:${err.value}`;
  }


  if(err.code == 11000){
    customError.status = StatusCodes.BAD_REQUEST;
    customError.msg = `This is duplicate error with that email:${Object.values(err.keyValue)}`;
  }


  if(err.name == "ValidationError"){
    customError.status = StatusCodes.BAD_REQUEST;
    customError.msg = `${Object.values(err.errors).map(item=> item.message).join(",")}`;
  }
  
  // return res.status(customError.status).json(err);
  return res.status(customError.status).json(customError.msg);
}

module.exports = errorHandlerMiddleware
