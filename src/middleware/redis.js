const redis = require('redis')
const client = redis.createClient()
const helper = require('../helpers/wrapper')

module.exports = {
  getUserByIdRedis: (req, res, next) => {
    const { id } = req.params
    client.get(`getuser:${id}`, (error, result) => {
      if (!error && result !== null) {
        console.log('Data ada di dalam redis')
        return helper.response(
          res,
          200,
          'Success:get data id by redis',
          JSON.parse(result)
        )
      } else {
        console.log('Data tidak ada di dalam redis')
        next()
      }
    })
  },

  getUserRedis: (req, res, next) => {
    client.get(`getuser:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result != null) {
        console.log('data ada di dalam redis')
        return helper.response(
          res,
          200,
          'Success Get All Data User By Redis',
          JSON.parse(result)
        )
      } else {
        console.log('data tidak ada di dalam redis')
        next()
      }
    })
  },
  getContactByIdRedis: (req, res, next) => {
    const { id } = req.params
    client.get(`getContactById:${id}`, (error, result) => {
      console.log(error)
      if (!error && result !== null) {
        console.log('Data ada di dalam redis')
        return helper.response(
          res,
          200,
          'Success get data contact by id Redis',
          JSON.parse(result)
        )
      } else {
        console.log('Data tidak ada di dalam redis')
        next()
      }
    })
  },
  getAllRoomChatRedis: (req, res, next) => {
    const { id } = req.params
    client.get(`getAllRoomChat:${id}`, (error, result) => {
      console.log(error)
      if (!error && result != null) {
        console.log('data ada di dalam redis')
        return helper.response(
          res,
          200,
          'Success Get All Data Room Chat By Redis',
          JSON.parse(result)
        )
      } else {
        console.log('data tidak ada di dalam redis')
        next()
      }
    })
  },
  getHistoryChatRedis: (req, res, next) => {
    const { id } = req.params
    client.get(`getHistoryChat:${id}`, (error, result) => {
      if (!error && result != null) {
        console.log('data ada di dalam redis')
        return helper.response(
          res,
          200,
          'Success Get All Data History Chat By Redis',
          JSON.parse(result)
        )
      } else {
        console.log('data tidak ada di dalam redis')
        next()
      }
    })
  },
  clearDataUserRedis: (req, res, next) => {
    client.keys('getContactById*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  },
  clearDataContactRedis: (req, res, next) => {
    client.keys('getHistoryChat*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  },
  clearDataRoomChatRedis: (req, res, next) => {
    client.keys('getAllRoomChat*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  },
  clearDataChatRedis: (req, res, next) => {
    client.keys('getHistoryChat*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  }
}
