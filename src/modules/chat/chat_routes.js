const express = require('express')
const Route = express.Router()
const chatController = require('./chat_controller')
const authMiddleware = require('../../middleware/auth')
// const uploadFile = require('../../middleware/uploads')
const redisMiddleware = require('../../middleware/redis')
const { geHistoryById } = require('./chat_controller')

Route.post(
  '/',
  authMiddleware.authentication,
  redisMiddleware.clearDataChatRedis,
  chatController.createChat
)
Route.get('/room/:id', authMiddleware.authentication, geHistoryById)
Route.get(
  '/:id',
  authMiddleware.authentication,
  redisMiddleware.getHistoryChatRedis,
  chatController.geHistoryChat
)
module.exports = Route
