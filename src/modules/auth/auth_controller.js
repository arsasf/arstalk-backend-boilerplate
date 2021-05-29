const helper = require('../../helpers/wrapper')
const bcrypt = require('bcrypt')
const authModel = require('./auth_model')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const fs = require('fs')
require('dotenv').config()

module.exports = {
  register: async (req, res) => {
    console.log('register running')
    console.log(req.body)
    try {
      const { userName, userEmail, userPassword } = req.body
      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(userPassword, salt)
      console.log(`Before encrypt = ${userPassword}`)
      console.log(`after encrypt = ${encryptPassword}`)
      const checkEmailUser = await authModel.getDataUser(userEmail)
      if (checkEmailUser.length === 0) {
        const setData = {
          user_name: userName,
          user_email: userEmail,
          user_password: encryptPassword
        }
        const result = await authModel.register(setData)
        delete result.user_password
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
          }
        })
        const mailOptions = {
          from: `"ArsTalk Team" <${process.env.SMTP_EMAIL}>`,
          to: userEmail,
          subject: 'ArsTalk Team - Activation Email',
          html: `<p>
                      <p>
                        <b>Hello ${userName}, <br/> Welcome to ArsTalk App Chatting. Click button for get link veification!</b>
                      </p>
                      <p>
                        <a href='http://localhost:3000/verify-register/${result.id}'>Click !</>
                      </p>
                    </p>`
        }
        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
            return helper.response(res, 400, 'Email not send !')
          } else {
            console.log('Email sent:' + info.response)
          }
        })
        return helper.response(
          res,
          200,
          'Success Register User, Please check your email to activation!',
          result
        )
      } else {
        return helper.response(
          res,
          409,
          'Your Email was resgistered, duplicated data !'
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 408, 'Bad Request', error)
    }
  },
  login: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body
      const checkEmailUser = await authModel.getDataConditions({
        user_email: userEmail
      })
      if (checkEmailUser[0].user_status === '1') {
        if (checkEmailUser.length > 0) {
          const checkPassword = bcrypt.compareSync(
            userPassword,
            checkEmailUser[0].user_password
          )
          if (checkPassword) {
            const payload = checkEmailUser[0]
            delete payload.user_password
            const token = jwt.sign({ ...payload }, 'RAHASIA', {
              expiresIn: '24h'
            })
            const result = { ...payload, token }
            return helper.response(res, 200, 'Success login !', result)
          } else {
            return helper.response(res, 400, 'Wrong Password !')
          }
        } else {
          return helper.response(res, 404, 'Email/ Account Not registered')
        }
      } else {
        return helper.response(
          res,
          400,
          'Email not verified, please check your email and verification !'
        )
      }
    } catch (error) {
      // console.log(error)
      return helper.response(res, 408, 'Bad Request', error)
    }
  },
  verify: async (req, res) => {
    try {
      const { hash } = req.params
      if (hash.length > 0) {
        const result = await authModel.verifyRegister(hash)
        return helper.response(res, 200, 'Success Verifikasi !', result)
      } else {
        return helper.response(res, 404, 'Data Not Found')
      }
    } catch (error) {
      return helper.response(res, 408, 'Bad Request', error)
    }
  },
  getDataUserById: async (req, res) => {
    try {
      const { id } = req.params
      const resultId = await authModel.getDataUserById(id)
      if (resultId.length > 0) {
        const result = await authModel.getDataUserById(id)
        return helper.response(res, 200, 'Success get data', result)
      }
      return helper.response(res, 404, 'Data not found')
    } catch (error) {
      console.log(error)
      return helper.response(res, 408, 'Bad Request', error)
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params
      const resultId = await authModel.getDataUserById(id)
      if (resultId.length > 0) {
        const { userFirstName, userLastName, userEmail, userPhoneNumber } =
          req.body
        switch (userFirstName) {
          case undefined:
            return helper.response(
              res,
              404,
              'Please click update profile near info, before update changes'
            )
          case '':
            return helper.response(
              res,
              404,
              'Please click update profile  near info, before update changes'
            )
          default:
            break
        }
        switch (userLastName) {
          case undefined:
            return helper.response(
              res,
              404,
              'Please click update profile near info, before update changes'
            )
          case '':
            return helper.response(
              res,
              404,
              'Please click update profile  near info, before update changes'
            )
          default:
            break
        }
        switch (userPhoneNumber) {
          case undefined:
            return helper.response(
              res,
              404,
              'Please click update profile near info, before update changes'
            )
          case '':
            return helper.response(
              res,
              404,
              'Please click update profile  near info, before update changes'
            )
          default:
            break
        }
        switch (req.file) {
          case undefined:
            return helper.response(
              res,
              404,
              'Update Failed, Please Input Image'
            )
          case '':
            return helper.response(
              res,
              404,
              'Update Failed, Please Input Image'
            )
          default:
            break
        }
        const setData = {
          user_image: req.file ? req.file.filename : '',
          user_first_name: userFirstName,
          user_last_name: userLastName,
          user_email: userEmail,
          user_phone_number: userPhoneNumber,
          user_updated_at: new Date(Date.now())
        }
        const pathFile = 'src/uploads/' + resultId[0].user_image
        if (fs.existsSync(pathFile)) {
          fs.unlink(pathFile, function (err) {
            if (err) throw err
            console.log('Oldest Image Success Deleted')
          })
        }
        const result = await authModel.updateData(setData, id)
        console.log(
          `Success update movie Id : ${id} and update image : ${result.user_image}\n`
        )
        return helper.response(res, 200, 'Success update Movie', result)
      }
    } catch (error) {
      return helper.response(res, 408, 'Bad Request', error)
    }
  },
  updatePasswordUser: async (req, res) => {
    try {
      const { id } = req.params
      const { userNewPassword, userConfirmPassword } = req.body
      switch (userNewPassword) {
        case undefined:
          return helper.response(
            res,
            404,
            'Update Failed, Please Input New Password'
          )
        case '':
          return helper.response(
            res,
            404,
            'Update Failed, Please Input New Password'
          )
        default:
          break
      }
      switch (userConfirmPassword) {
        case undefined:
          return helper.response(
            res,
            404,
            'Update Failed, Please Input Confirm Password'
          )
        case '':
          return helper.response(
            res,
            404,
            'Update Failed, Please Input Confirm Password'
          )
        default:
          break
      }
      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(userNewPassword, salt)
      console.log(`Before encrypt = ${userNewPassword}`)
      console.log(`after encrypt = ${encryptPassword}`)
      if (userNewPassword !== userConfirmPassword) {
        return helper.response(
          res,
          403,
          'New Password and Confirm Password are different, please check again!'
        )
      } else {
        const setData = {
          user_password: encryptPassword
        }
        const result = await authModel.updateData(setData, id)
        delete result.user_password
        console.log('Sucess Update New Password !')
        return helper.response(res, 200, 'Success Update New Password', result)
      }
    } catch (error) {
      return helper.response(res, 408, 'Bad Request', error)
    }
  }
}
