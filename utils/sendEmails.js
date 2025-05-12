import nodemailer from 'nodemailer';

const sendEmails = async ({to,subject,html}) =>
{
    const transporter =  nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
    });
    
    const info = await transporter.sendMail({
        from: `"Ammar 👻" <${process.env.EMAIL}>`, // sender address
        to,  // list of receivers
        subject, 
        html, 
    });
    return info.rejected.length === 0 ? true : false;
}

export const subjects = {
    register: "Account Activation"
}

export default sendEmails