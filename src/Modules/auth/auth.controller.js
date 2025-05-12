import { Router } from "express";
import validation from "./../../middleware/validation.middleware.js";
import {asyncHandler} from "./../../../utils/asyncHandler.js"
import {register,login,sendOTP, forgetPassword, resetPassword, newAccess} from "./auth.service.js";
import * as userValidation from "./../user/user.validation.js";

const router = Router();


// passwords
router.post('/forget-password',validation(userValidation.forgetPassword),asyncHandler(forgetPassword));
router.post('/reset-password',validation(userValidation.resetPassword),asyncHandler(resetPassword));

// registeration with otp and login
router.post("/register",validation(userValidation.register),asyncHandler(register));
router.post("/login",validation(userValidation.login),asyncHandler(login));
router.post('/send-otp',validation(userValidation.otp),asyncHandler(sendOTP));

// refresh access token
router.post('/access-token',validation(userValidation.newAccess),asyncHandler(newAccess));

export default router;