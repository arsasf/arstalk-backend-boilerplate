const helper = require('../../helpers/wrapper')
const userModel = require('./user_model')
const redis = require('redis')
const client = redis.createClient()
const fs = require('fs')

// const nodemailer = require('nodemailer')
// const bcrypt = require('bcrypt')

module.exports = {
  getUser: async (req, res) => {
    try {
      // console.log(req.query)
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
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  getUserById: async (req, res) => {
    try {
      console.log(req.params)
      const { id } = req.params
      const result = await userModel.getUserById(id)
      if (result.length === 0) {
        return helper.response(res, 404, `data by id ${id} not found !`, null)
      }
      delete result[0].password_worker

      client.setex(`getuser:${id}`, 3600, JSON.stringify(result))

      return helper.response(res, 200, 'Succes get data !', result)
    } catch (error) {
      // console.log(error)
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
      console.log(setData)
      if (setData.image !== checkUser[0].image) {
        console.log(true)
        const pathFile = 'src/uploads/' + checkUser[0].image
        if (fs.existsSync(pathFile)) {
          fs.unlink(pathFile, function (err) {
            if (err) throw err
            console.log('Oldest Image Success Deleted')
          })
        }
      }
      console.log(false, 'data same, cannot delete')
      const result = await userModel.updateUser(setData, id)
      return helper.response(res, 200, 'Succes update data !', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  }

  // passChangeRequest: async (req, res) => {
  //   try {
  //     const { email } = req.body
  //     const isExist = await workerModel.getWorkerByEmail(email)

  //     if (isExist.length === 0) {
  //       return helper.response(res, 404, 'Email not recognized', null)
  //     } else {
  //       const token = Math.ceil(Math.random() * 9001) + 998

  //       const transporter = nodemailer.createTransport({
  //         service: 'gmail',
  //         auth: {
  //           user: process.env.email,
  //           pass: process.env.emailPass
  //         }
  //       })

  //       const mailOptions = {
  //         from: process.env.email,
  //         to: isExist[0].email_worker,
  //         subject: 'Your forget password token',
  //         html: `
  //         <h1>Your reset password token</h1>
  //         <p>Use '${token}' to reset your password.</p>
  //         <p>Token will automatically expired in 5 minutes.</p>
  //         `
  //       }

  //       transporter.sendMail(mailOptions, (err, info) => {
  //         if (err) throw err
  //         console.log('email sent: ' + info.response)
  //       })

  //       const id = isExist[0].id_worker
  //       const setData = {
  //         worker_updated_at: new Date(Date.now()),
  //         reset_token: token
  //       }

  //       const result = await workerModel.updateWorker(setData, id)
  //       return helper.response(res, 200, 'OTP sent', result)
  //     }
  //   } catch (error) {
  //     return helper.response(res, 400, 'Bad request', Error)
  //   }
  // },

  // changePassword: async (req, res) => {
  //   try {
  //     const { email, newPassword } = req.body
  //     let { otp } = req.body
  //     otp = +otp
  //     const salt = bcrypt.genSaltSync(10)
  //     const encryptedPassword = bcrypt.hashSync(newPassword, salt)
  //     const isExist = await workerModel.getWorkerByEmail(email)

  //     if (isExist.length === 0) {
  //       return helper.response(res, 404, 'Email not recognized', null)
  //     } else {
  //       const isExpired = new Date(Date.now()) - isExist[0].worker_updated_at
  //       if (otp !== isExist[0].reset_token || isExpired > 300000) {
  //         console.log(isExist)
  //         return helper.response(
  //           res,
  //           300,
  //           'Otp mismatch or has been expired',
  //           null
  //         )
  //       } else {
  //         const id = isExist[0].id_worker
  //         const setData = {
  //           password_worker: encryptedPassword,
  //           worker_updated_at: new Date(Date.now())
  //         }
  //         const result = await workerModel.updateWorker(setData, id)
  //         return helper.response(res, 200, 'Password changed', result)
  //       }
  //     }
  //   } catch (error) {
  //     return helper.response(res, 400, 'Bad request', Error)
  //   }
  // }
}
