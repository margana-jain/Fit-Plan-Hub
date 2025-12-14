const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')


const authUser = async (req, res, next) => {
  
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.send(StatusCodes.UNAUTHORIZED).json('Authentication invalid');
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {userId: payload.userId,  name: payload.name, role: payload.role}
    next()
  } catch (error) {
    
    res.send(StatusCodes.UNAUTHORIZED).json('Authentication invalid ');
    
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: 'Unauthorized to access this route' 
      });
    }
    next();
  };
};

module.exports = {
  authUser,
  authorizePermissions,
};