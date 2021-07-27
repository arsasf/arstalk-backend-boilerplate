const helper = require('../../helpers/wrapper')
const contactModel = require('./contact_model')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  geContact: async (req, res) => {
    try {
      const idUser = req.params.id
      let { search } = req.query
      search = search || ''
      const result = await contactModel.getAllContact(idUser, search)
      if (result.length > 0) {
        client.setex(`getContactById:${idUser}`, 3600, JSON.stringify(result))
        return helper.response(res, 200, 'user found !', result)
      } else {
        return helper.response(res, 404, 'user not found !')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  createContact: async (req, res) => {
    try {
      const { contactFriendId } = req.body
      const { id } = req.params
      const idUser = req.params.id
      const idFriend = req.body.contactFriendId
      const checkFriend = await contactModel.getContactById(idUser, idFriend)
      if (checkFriend.length > 0) {
        return helper.response(res, 408, 'Contact was added')
      } else {
        if (id !== contactFriendId) {
          const setData = {
            contact_user_id: id,
            contact_friend_id: contactFriendId
          }
          const result = await contactModel.addContact(setData)
          return helper.response(res, 200, 'Succes add contact!', result)
        }
        return helper.response(res, 408, 'Can not added contact with same id!')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  deleteContact: async (req, res) => {
    try {
      const idUser = req.params.id
      const { idFriend } = req.query
      const resultId = await contactModel.getContactById(idUser, idFriend)
      if (resultId.length > 0) {
        const result = await contactModel.deleteContact(idUser, idFriend)
        return helper.response(
          res,
          200,
          `Success Delete contact Id : ${idFriend}`,
          result
        )
      } else {
        return helper.response(
          res,
          404,
          `Contact By Id ${idFriend} Not Found !`,
          null
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
