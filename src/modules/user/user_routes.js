const express = require('express')
const Route = express.Router()
const userController = require('./user_controller')
const authMiddleware = require('../../middleware/auth')
const uploadFile = require('../../middleware/uploads')
const redisMiddleware = require('../../middleware/redis')

Route.get('/', userController.getUser)
Route.get(
  '/:id',
  authMiddleware.authentication,
  redisMiddleware.getUserByIdRedis,
  userController.getUserById
)
Route.patch(
  '/profile/:id',
  authMiddleware.authentication,
  authMiddleware.isUser,
  uploadFile,
  redisMiddleware.clearDataUserRedis,
  userController.updateUser
)
module.exports = Route
