const helper = require('../../helpers/wrapper')
const chatRoom = require('../roomchat/roomchat_model')
const chat = require('./chat_model')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  geHistoryChat: async (req, res) => {
    try {
      const idUser = req.params.id
      const result = await chat.getAllHistoryChat(idUser)
      // if (result.length > 0) {
      client.setex(`getHistoryChat:${idUser}`, 3600, JSON.stringify(result))
      return helper.response(res, 200, 'user found !', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  geHistoryById: async (req, res) => {
    try {
      const { id } = req.params
      const { room } = req.body
      const result = await chat.getChatById(id, room)
      // if (result.length > 0) {
      // client.setex(`getHistoryChat:${id}`, 3600, JSON.stringify(result))
      return helper.response(res, 200, 'Succcess get chat by room!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  createChat: async (req, res) => {
    try {
      const { receiverId, message } = req.body
      const { senderId } = req.params
      const getRoom = await chatRoom.getRoomById(senderId, receiverId)
      console.log(receiverId, 'adalah id friend')
      console.log(senderId, 'adalah id user')
      console.log(getRoom[0].room_chat)
      const roomChat = getRoom[0].room_chat
      const setData1 = {
        room_chat: roomChat,
        sender_id: senderId,
        receiver_id: receiverId,
        message: message
      }
      const setData2 = {
        room_chat: roomChat,
        sender_id: receiverId,
        receiver_id: senderId,
        message: message
      }
      await chat.addChat(setData1)
      const result = await chat.addChat(setData2)
      console.log('Succes send chat !')
      return helper.response(res, 200, 'Succes send chat !', result)
    } catch (error) {
      console.log(false)
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
