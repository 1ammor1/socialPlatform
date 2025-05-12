import { verifyToken } from "../../utils/token/token.js";
import User from "../DB/models/user.model.js";

const isAuthenticated = async (req,res,next)=>{
            try {
            // token
            const token = req.headers.authorization;
            // verify token 
            const {id} = verifyToken({token:token});
            // user 
            const user = await User.findById(id).lean();
            if(!user)
                return res.status(404).json({success:false, message:"User not found!"});

            if(!user.isLoggedIn) return next(new Error("Try to log in!"));
            req.user = user;
            return next();
            } catch (error) {
                return res.status(403).json({error : error.message, stack: error.stack});
            }
}

export default isAuthenticated