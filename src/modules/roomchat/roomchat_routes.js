const express = require('express')
const Route = express.Router()
const roomChatController = require('./roomchat_controller')
const authMiddleware = require('../../middleware/auth')
const redisMiddleware = require('../../middleware/redis')

Route.post(
  '/:id',
  authMiddleware.authentication,
  redisMiddleware.clearDataRoomChatRedis,
  roomChatController.createRoom
)
// Route.delete('/:id', roomChatController.deleteroomChat)
Route.get(
  '/:id',
  authMiddleware.authentication,
  redisMiddleware.getAllRoomChatRedis,
  roomChatController.geRoomChat
)
module.exports = Route
