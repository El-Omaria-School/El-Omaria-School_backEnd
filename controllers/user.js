const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { validatUsers } = require('../validations/user')
const { JWT_SECRET } = require('../constants')
const BadRequestError = require('../handleErrors/badRequestError')
const ValidationError = require('../handleErrors/validationError')
const crypto = require('crypto')
const User = require('../models/user')

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository
    this.otpStore = {}
  }

  generateOTP() {
    return crypto.randomBytes(3).toString('hex')
  }

  async sendOTPEmail(email, otp) {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    })

    let mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: 'Your OTP Code',
      html: `<div>
      <h3>Enter OTP code below</h3>
      <h4 style='color: #F00'>${otp}</h4>
      </div>`,
    }

    await transporter.sendMail(mailOptions)
  }

  async createNewUser(body) {
    const { error } = validatUsers(body)
    if (error) {
      throw new ValidationError(`Invalid data ${error.message}`)
    }

    const { email, password } = body
    const existingUser = await this.userRepository.findUserByEmail(email)
    if (existingUser) {
      throw new BadRequestError('This email already exists.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await this.userRepository.createNewUser({
      ...body,
      password: hashedPassword,
    })

    const otp = this.generateOTP()
    const expiry = Date.now() + 5 * 60 * 1000
    this.otpStore[email] = { otp, expiry }

    try {
      await this.sendOTPEmail(email, otp)
    } catch (error) {
      console.log(error)
      throw new Error('Error sending OTP')
    }

    return newUser
  }

  async verifyOtpAndLogin(body) {
    const { email, otp } = body

    if (!email || !otp) {
      throw new BadRequestError('Email and OTP are required.')
    }

    const record = this.otpStore[email]
    if (record) {
      const { otp: storedOtp, expiry } = record
      if (Date.now() > expiry) {
        delete this.otpStore[email]
        throw new BadRequestError('OTP expired')
      }

      if (storedOtp === otp) {
        delete this.otpStore[email]
        await User.updateOne({ email }, { verified: true })
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' })
        return token
      }
    }
    throw new BadRequestError('Invalid OTP')
  }

  async loginWithPassword(body) {
    const { email, password } = body

    if (!email || !password) {
      throw new BadRequestError('Email and password are required.')
    }

    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw new BadRequestError('Incorrect email or password.')
    }

    if (!user.verified) {
      throw new BadRequestError(
        'Email not verified. Please verify your email first.',
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new BadRequestError('Incorrect email or password.')
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' })

    return token
  }

  async sendOtpForLogin(email) {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      throw new BadRequestError('User not found.')
    }

    const otp = this.generateOTP()
    const expiry = Date.now() + 5 * 60 * 1000

    this.otpStore[email] = { otp, expiry }

    try {
      await this.sendOTPEmail(email, otp)
    } catch (error) {
      throw new Error('Error sending OTP')
    }
  }

  async resetPassword({ email, otp, newPassword }) {
    if (!email || !otp || !newPassword) {
      throw new BadRequestError('Email, OTP and password are required.')
    }
    await this.verifyOtpAndLogin({email, otp})
    const newPass = await bcrypt.hash(newPassword, 10)
    await User.updateOne({ email }, { password: newPass })
  }

  async getAllUser() {
    return await this.userRepository.getAllUser()
  }
}

module.exports = UserController
