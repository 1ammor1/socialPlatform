import EventEmitter from "events";
import sendEmails from "./sendEmails.js";
import signup from "./generateActivation.js";
import jwt from "jsonwebtoken";
import { subjects } from "./sendEmails.js";

export const emailEvent = new EventEmitter();
emailEvent.on("sendEmails", async(email,otp)=>{
     const isSent = await sendEmails({to: email , subject: subjects.register ,html: await signup(otp)});

})