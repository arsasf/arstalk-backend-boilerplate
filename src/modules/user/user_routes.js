const express = require('express')
const Route = express.Router()
const userController = require('./user_controller')
const authMiddleware = require('../../middleware/auth')
const uploadFile = require('../../middleware/uploads')

Route.get('/', userController.getUser)
Route.get('/:id', authMiddleware.authentication, userController.getUserById)
Route.patch(
  '/profile/:id',
  authMiddleware.authentication,
  authMiddleware.isUser,
  uploadFile,
  userController.updateUser
)
module.exports = Route
