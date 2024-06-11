const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validatUsers } = require("../validations/user");
const { JWT_SECRET } = require("../constants");
const BadRequestError = require("../handleErrors/badRequestError");
const ValidationError = require("../handleErrors/validationError");
const crypto = require("crypto");
const AuthError = require("../handleErrors/authError");

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.otpStore = {};
  }

  generateOTP() {
    return crypto.randomBytes(3).toString("hex");
  }

  async sendOTPEmail(email, otp) {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    let mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Your OTP Code",
      html: `<div>
      <h3>Enter OTP code below</h3>
      <h4 style='color: #F00'>${otp}</h4>
      </div>`,
    };

    await transporter.sendMail(mailOptions);
  }

  async createNewUser(body) {
    const { error } = validatUsers(body);
    if (error) {
      throw new ValidationError(`Invalid data ${error.message}`);
    }

    const { email, password } = body;
    const existingUser = await this.userRepository.findUserByEmail(email);

    if (existingUser && existingUser.verified) {
      throw new BadRequestError("This email already exists.");
    }

    if (existingUser && !existingUser.verified) {
      const otp = this.generateOTP();
      const expiry = Date.now() + 5 * 60 * 1000;
      this.otpStore[email] = { otp, expiry };

      await this.sendOTPEmail(email, otp);

      throw new AuthError("Email not verified.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.createNewUser({
      ...body,
      password: hashedPassword,
    });

    const otp = this.generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000;
    this.otpStore[email] = { otp, expiry };

    try {
      await this.sendOTPEmail(email, otp);
    } catch (error) {
      throw new Error("Error sending OTP");
    }

    return newUser;
  }

  async verifyOtp(body) {
    const { email, otp } = body;

    if (!email || !otp) {
      throw new BadRequestError("Email and OTP are required.");
    }

    const record = this.otpStore[email];
    if (record) {
      const { otp: storedOtp, expiry } = record;
      if (Date.now() > expiry) {
        delete this.otpStore[email];
        throw new BadRequestError("OTP expired");
      }

      if (storedOtp === otp) {
        delete this.otpStore[email];
        await this.userRepository.update(email, { verified: true });
        const token = jwt.sign({ email, type: "otp" }, JWT_SECRET, {
          expiresIn: "15m",
        }); // Shorter expiry
        return { token, message: "Email verified successfully" };
      }
    }
    throw new BadRequestError("Invalid OTP");
  }

  async login(body) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required.");
    }

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestError("Incorrect email or password.");
    }

    if (!user.verified) {
      const otp = this.generateOTP();
      const expiry = Date.now() + 5 * 60 * 1000;
      this.otpStore[email] = { otp, expiry };

      await this.sendOTPEmail(email, otp);

      throw new AuthError("Email not verified.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestError("Incorrect email or password.");
    }

    const token = jwt.sign({ email, type: "auth" }, JWT_SECRET, {
      expiresIn: "1d",
    }); // Longer expiry
    return { token, message: "Login successful" };
  }

  async resendOtp(email) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found.");
    }

    const otp = this.generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000;

    this.otpStore[email] = { otp, expiry };

    try {
      await this.sendOTPEmail(email, otp);
    } catch (error) {
      console.log(error);
      throw new Error("Error sending OTP");
    }
  }

  async resetPassword({ email, newPassword }) {
    if (!email || !newPassword) {
      throw new BadRequestError("Email and password are required.");
    }
    const newPass = await bcrypt.hash(newPassword, 10);
    await this.userRepository.savePass(email, newPass);
  }

  async UpdateUserProfile(auth, body) {
    const user = auth;
    const bodyClone = structuredClone(body);

    if (bodyClone.email) throw new BadRequestError(`can't change email!`);

    if (bodyClone.password) {
      if (!bodyClone.oldPassword) {
        throw new BadRequestError("Old password is required!");
      }
      const isValidOldPassword = await bcrypt.compare(
        bodyClone.oldPassword,
        user.password
      );
      if (!isValidOldPassword) {
        throw new BadRequestError("Incorrect old password!");
      }
      if (bodyClone.oldPassword === bodyClone.password)
        throw new BadRequestError(
          "New password must be different from the old password!"
        );
      const encryptedPassword = await bcrypt.hash(bodyClone.password, 10);
      bodyClone.password = encryptedPassword;
    }

    return await this.userRepository.updateProfile(user.email, bodyClone);
  }

  async getCurrentUserProfile(auth) {
    const user = auth;
    return await this.userRepository.findUserByEmail(user.email);
  }

  async getAllUser(skip, limit, email) {
    return await this.userRepository.getAllUser(skip, limit, email);
  }
}

module.exports = UserController;
