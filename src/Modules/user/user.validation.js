import joi from "joi";
import {gender, roles} from "./../../DB/models/user.model.js";



// forget password
export const forgetPassword = joi.object({
    email: joi.string().email().required(),
}).required();
// reset password
export const resetPassword = joi.object({
    email: joi.string().email().required(),
    newpassword: joi.string().required(),
    confirmnewpassword: joi.string().valid(joi.ref("newpassword")).required(),
    otp: joi.string().length(5).required(),
}).required();
export const newAccess= joi.object({
    refresh_token: joi.string().required(),
})
// otp
export const otp = joi.object({
    email: joi.string().email().required(),
}).required();

// register schema
export const register = joi.object({
    email: joi.string().email().required(),
    name: joi.string().min(3).max(40).required(),
    password: joi.string().required(),
    confirmpassword: joi.string().valid(joi.ref("password")).required(),
    otp: joi.string().length(5).required(),
    role: joi.string().valid(...Object.values(roles)).default(roles.user),

}).required();

// login schema
export const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
}).required();

// update Profile
export const updateProfile = joi.object({
    username: joi.string().min(3).max(40).required(),
    email: joi.string().email().required(),
    phone: joi.string().required(),
})

export const updatePassword = joi.object({
    oldpassword: joi.string().required(),
    newPassword: joi.string().not(joi.ref("oldPassword")).messages({"any.invalid": "new password must be not the same as old password!"}).required(),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
})

export const deactivateAccount=joi.object({
    password: joi.string().required(),
})