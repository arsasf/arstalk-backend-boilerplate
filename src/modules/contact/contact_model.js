const connection = require('../../config/mysql')

module.exports = {
  getAllContact: (id, search) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user JOIN contact ON user.user_id = contact.contact_friend_id WHERE contact.contact_user_id = ? AND user.user_fullname LIKE "%"?"%"',
        [id, search],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getContactById: (idUser, idFriend) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user JOIN contact ON user.user_id = contact.contact_user_id WHERE contact.contact_user_id = ? AND contact.contact_friend_id= ?',
        [idUser, idFriend],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  addContact: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO contact SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  deleteContact: (idUser, idFriend) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM contact WHERE contact_user_id = ? AND contact_friend_id = ?',
        [idUser, idFriend],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: idFriend
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
