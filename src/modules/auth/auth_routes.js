const express = require('express')
// const { isUser } = require('../../middleware/auth')
const Route = express.Router()
const authMiddleware = require('../../middleware/auth')
// const uploadFile = require('../../middleware/uploads')

const { clearDataUserRedis } = require('../../middleware/redis')
const {
  register,
  login,
  verify,
  updateUserOffline
} = require('./auth_controller')

Route.post('/login', login)
Route.post('/register', register)
Route.get('/verify/:hash', verify)
Route.get(
  '/logout/status-user/:id',
  authMiddleware.authentication,
  clearDataUserRedis,
  updateUserOffline
)
module.exports = Route
