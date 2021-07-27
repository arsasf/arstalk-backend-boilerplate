const helper = require('../../helpers/wrapper')
const chat = require('./chat_model')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  geHistoryChat: async (req, res) => {
    try {
      const idUser = req.params.id
      const result = await chat.getAllHistoryChat(idUser)
      client.setex(`getHistoryChat:${idUser}`, 3600, JSON.stringify(result))
      return helper.response(res, 200, 'user found !', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  geHistoryById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await chat.getChatById(id)
      return helper.response(res, 200, 'Succcess get chat by room!', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  createChat: async (req, res) => {
    try {
      const { room, senderId, receiverId, image, message } = req.body
      const setData = {
        room_chat: room,
        sender_id: senderId,
        receiver_id: receiverId,
        image: image,
        message: message
      }
      const result = await chat.addChat(setData)
      return helper.response(res, 200, 'Succes send chat !', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
