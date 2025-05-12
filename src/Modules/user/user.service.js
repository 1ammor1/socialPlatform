import User, { defaultProfilePicture } from "./../../DB/models/user.model.js";
import { compare, hash } from "../../../utils/hashing/hashing.js";
import { verifyToken } from "../../../utils/token/token.js";
import { encrypt } from "../../../utils/encryption/encryption.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/file uploading/cloudinary.config.js";
import fs from "fs";
import path from "path";


export const profile = asyncHandler(async (req, res,next) => {
        const {user:{_id:id}} = req;
        const userr = await User.findById(id).select("-password").lean();
        return res.status(201).json({success: true, results: userr});

})
export const updateUser = asyncHandler(async (req, res,next) => {
    try {
        const {id} = req.params;
        const{password,phone,...rest} = req.body;
        const updateFields = {...rest};
        if(password)  {updateFields.password = hash(password);}
        if (phone)  {updateFields.phone = encrypt(phone)}
        const user = await User.findByIdAndUpdate({_id: id},updateFields,{new: true , runValidators: true});
        res.status(201).json({success: true,message: "User Updated successfully", results: user });
    } catch (error) {
        return next(new Error(error));
    }
})
export const activateAccount = asyncHandler(async(req,res,next)=>{
    try {
    const {token } =req.params;
    const {email} = verifyToken({token});
    const user = await User.findOne({email: email});
    if(!user)
        return next(new Error("User Doesn't exist!", {cause: 404}));
    user.isActivated= true;
    await user.save();
    return res.status(200).json({success:true , message:"try to login"});
    } catch (error) {
        return next(new Error(error));
    }

})

export const updateProfile = asyncHandler(async(req,res,next)=>{
    const {user} = req;
    if(req.body.phone)
    {
        req.body.phone= encrypt({plainText: req.body.phone});
    }
    const updatedUser = await User.findByIdAndUpdate(user._id,{...req.body},{new: true , runValidators: true});
    return res.status(200).json({success:true,results: {user: updatedUser}});
})

export const updatePassword = asyncHandler(async(req,res,next)=>{
    const {oldpassword,newPassword} = req.body;
    const {user} = req;
    const userr = await User.findById(user._id);
    if(!compare({plainText: oldpassword, hashText: userr.password})) return next(new Error("Password Invalid!", {cause: 403}));
   
    const updatedUser = await User.findByIdAndUpdate(user._id,{password: hash({plainText: newPassword})},{new: true , runValidators: true});
    user.isLoggedin = false;
    await userr.save();
    return res.status(200).json({success:true,results: {user: updatedUser}});
})

export const deactivateAccount = asyncHandler(async(req,res,next)=>{
    const {password} = req.body;
    const user = await User.findById(req.user._id);
    if(!compare({plainText: password, hashText: user.password})) 
        return next(new Error("Password Invalid!", {cause: 403}));
    user.freezed = true;
    user.isLoggedIn= false;
    await user.save();
    return res.status(200).json({success:true,message:"Account Deactivated!"});

})

// export const profilePicture = asyncHandler(async(req,res,next)=>{

//     const user = await User.findByIdAndUpdate(req.user._id,{profilePicture: req.file.path},{new: true });
//     return res.status(200).json({success:true,results: {user}});
// })
export const profilePicture = asyncHandler(async(req,res,next)=>{

    const user = await User.findById(req.user._id);
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder: `users/${user._id}/profilePictures`});
    user.profilePicture={secure_url,public_id};
    await user.save();
    return res.json({success:true,results: {user}});
})

// export const deleteProfilePicture = asyncHandler(async(req,res,next)=>{

//     const user = await User.findById(req.user._id);
//     const imgPath = path.resolve(".", user.profilePicture);
//     fs.unlinkSync(imgPath);
//     user.profilePicture = defaultProfilePicture;
//     await user.save();
//     return res.status(200).json({success:true,results: {user}});
    
// })
export const deleteProfilePicture = asyncHandler(async(req,res,next)=>{

    const user = await User.findById(req.user._id);
    const results = await cloudinary.uploader.destroy(user.proflePicture.public_id);
    if(results.result== "ok")
    {
        user.profilePicture = {
            secure_url: "https://res.cloudinary.com/dgejlb6lx/image/upload/v1746308084/default-avatar-icon-of-social-media-user-vector_lyag02.jpg",
            public_id: "default-avatar-icon-of-social-media-user-vector_lyag02"
        };
    }
    await user.save();
    return res.status(200).json({success:true,results: {user}});
    
})
export const coverPictures = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    user.coverPictures= req.files.map((file)=>file.path);
    await user.save();
    return res.status(200).json({success:true,results: {user}});
})