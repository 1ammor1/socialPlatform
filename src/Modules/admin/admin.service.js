import User from "../../DB/models/user.model.js";
import Post from "../../DB/models/post.model.js";

export const getAll= async(req,res,next)=>{
    const results= await Promise.all([User.find(),Post.find()]);
    return res.json({success:true,results});
}

export const changeRole= async(req,res,next)=>{
    const {userID,role}= req.body;
    const user= await User.findOneAndUpdate({_id: userID},{role},{new: true});
    return res.json({success:true,results: {user}});
}