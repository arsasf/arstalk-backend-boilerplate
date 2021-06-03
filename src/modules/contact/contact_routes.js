const express = require('express')
const Route = express.Router()
const contactController = require('./contact_controller')
const authMiddleware = require('../../middleware/auth')
const redisMiddleware = require('../../middleware/redis')

Route.post(
  '/:id',
  authMiddleware.authentication,
  redisMiddleware.clearDataContactRedis,
  contactController.createContact
)
Route.delete(
  '/:id',
  authMiddleware.authentication,
  redisMiddleware.clearDataContactRedis,
  contactController.deleteContact
)
Route.get(
  '/:id',
  authMiddleware.authentication,
  redisMiddleware.getContactByIdRedis,
  contactController.geContact
)
module.exports = Route
