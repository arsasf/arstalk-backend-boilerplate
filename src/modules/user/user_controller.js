const helper = require('../../helpers/wrapper')
const userModel = require('./user_model')
const redis = require('redis')
const client = redis.createClient()
const fs = require('fs')

module.exports = {
  getUser: async (req, res) => {
    try {
      let { search } = req.query
      search = search || ''
      const result = await userModel.getAllUser(search)
      if (result.length > 0) {
        client.setex(
          `getuser:${JSON.stringify(req.query)}`,
          3600,
          JSON.stringify({ result })
        )
        return helper.response(res, 200, 'user found !', result)
      } else {
        return helper.response(res, 404, 'user not found !')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.getUserById(id)
      if (result.length === 0) {
        return helper.response(res, 404, `data by id ${id} not found !`, null)
      }
      delete result[0].password_worker

      client.setex(`getuser:${id}`, 3600, JSON.stringify(result))

      return helper.response(res, 200, 'Succes get data !', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params

      const checkUser = await userModel.getUserById(id)
      if (checkUser.length === 0) {
        return helper.response(
          res,
          404,
          `Cannot update profile, data by id ${id} not found !`,
          null
        )
      }

      const setData = {}
      for (const [key, value] of Object.entries(req.body)) {
        setData[helper.convertToSnakeCase(key)] = value
      }
      setData.image = req.file ? req.file.filename : checkUser[0].image
      setData.user_updated_at = new Date(Date.now())
      if (setData.image !== checkUser[0].image) {
        const pathFile = 'src/uploads/' + checkUser[0].image
        if (fs.existsSync(pathFile)) {
          fs.unlink(pathFile, function (err) {
            if (err) throw err
            console.log('Oldest Image Success Deleted')
          })
        }
      }
      const result = await userModel.updateUser(setData, id)
      return helper.response(res, 200, 'Succes update data !', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
