const express = require('express')
// const { isUser } = require('../../middleware/auth')
const Route = express.Router()
// const authMiddleware = require('../../middleware/auth')
// const uploadFile = require('../../middleware/uploads')
const {
  register,
  login,
  verify
  // updateProfile,
  // updatePasswordUser,
  // getDataUserById
} = require('./auth_controller')

Route.post('/login', login)
Route.post('/register', register)
Route.get('/verify/:hash', verify)
// Route.get('/:id', authMiddleware.authentication, isUser, getDataUserById)
// Route.patch(
//   '/update-profile/:id',
//   authMiddleware.authentication,
//   isUser,
//   uploadFile,
//   updateProfile
// )
// Route.patch(
//   '/update-password/:id',
//   authMiddleware.authentication,
//   isUser,
//   updatePasswordUser
// )
module.exports = Route
