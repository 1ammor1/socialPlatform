import { compare, hash } from "./../../../utils/hashing/hashing.js";
import { emailEvent } from "./../../../utils/emailEvent.js";
import { generateToken } from "./../../../utils/token/token.js";
import { encrypt } from "./../../../utils/encryption/encryption.js";
import User from "./../../DB/models/user.model.js";
import OTP from "../../DB/models/otp.model.js";
import randomstring from "randomstring";

// passwords
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return next(new Error("User doesn't exist!", { cause: 404 }));
  const otp = randomstring.generate({
    length: 5,
    charset: "alphabetic",
  });

  emailEvent.emit("sendEmails", email, otp);
  await OTP.create({ email: email, otp: otp });
  res.status(200).json({ success: true, message: "OTP sent Successfully!" });
};
export const resetPassword = async (req, res, next) => {
  const { email, otp, newpassword } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return next(new Error("User doesn't exist!", { cause: 404 }));

  const otpExist = await OTP.findOne({ email: email, otp: otp });
  if (!otpExist) return next(new Error("Invalid OTP", { cause: 404 }));

  user.password = hash({ plainText: newpassword });
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Password Reset Successfully!" });
};
// registeration with otp and login
export const register = async (req, res, next) => {
  const { email, otp } = req.body;
  const otpExist = OTP.findOne(otp, email);
  if (!otpExist) return next(new Error("Invalid OTP", { cause: 404 }));
  const user = await User.create({
    ...req.body,
    password: hash({ plainText: req.body.password }),
    phone: encrypt({ plainText: req.body.phone }),
    isActivated: true,
  });
  return res
    .status(201)
    .json({ success: true, message: "User Created Successfully" });
};
export const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (user) return next(new Error("User Already exists!", { cause: 404 }));
  const otp = randomstring.generate({
    length: 5,
    charset: "alphabetic",
  });

  emailEvent.emit("sendEmails", email, otp);
  await OTP.create({ email: email, otp: otp });
  res.status(200).json({ success: true, message: "OTP sent Successfully!" });
};
export const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // email existence
  if (!user) return next(new Error("Email Invalid!", { cause: 404 }));
  // password match
  if (!compare({ plainText: req.body.password, hashText: user.password }))
    return next(new Error("Password Invalid!", { cause: 403 }));
  // is activated
  if (!user.isActivated)
    return next(new Error("Account Not Activated!", { cause: 403 }));
  // is freezed
  if (user.freezed == true) {
    return next(new Error("Account Freezed!", { cause: 403 }));
  }
  user.isLoggedIn = true;
  await user.save();
  return res
    .status(200)
    .json({
      succcess: true,
      message: "Logged in Successfully!",
      access_token: generateToken({
        payload: { id: user._id, email: user.email },
        options: { expiresIn: process.env.ACCESS_KEY_EXPIRE },
      }),
      refresh_token: generateToken({
        payload: { id: user._id, email: user.email },
        options: { expiresIn: process.env.REFRESH_KEY_EXPIRE },
      }),
    });
};
// refresh access token
export const newAccess = async (req, res, next) => {
  const { refresh_token } = req.body;
  const { email } = verifyToken({ token: refresh_token });
  const user = await User.findOne({ email: email });
  if (!user) return next(new Error("User Doesn't exist!", { cause: 404 }));
  return res
    .status(200)
    .json({
      success: true,
      access_token: generateToken({
        payload: { id: user._id, email: user.email },
        options: { expiresIn: proccess.env.ACCESS_KEY_EXPIRE },
      }),
    });
};
