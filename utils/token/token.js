import jwt from "jsonwebtoken";

export const generateToken = ({payload,signature = process.env.JWT,options})=>{
    return jwt.sign(payload,signature,options);
}

export const verifyToken = ({token,signature = process.env.JWT})=>{
    return jwt.verify(token,signature);
}
