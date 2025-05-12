import { Schema,model } from "mongoose";

// schema 
const otpSchema = new Schema({
    email: {type: String , required: true},
    otp: {type: String , required: true},
},
{timestamps: true},)

otpSchema.index({createdAt: 1},{expireAfterSeconds: 120});
const OTP = model("OTP", otpSchema);

export default OTP;