import { roles } from "../../DB/models/user.model.js";

export const canChangeRole = (req,res,next)=>{
    const allRoles = Object.values(roles);
    const userReq= req.user;
    const targetUser = req.body;

    const userReqRole= userReq.role;
    const targetUserRole= targetUser.role ;

    const userReqIndex= allRoles.indexOf(userReqRole); // superadmin =0 
    const targetUserIndex= allRoles.indexOf(targetUserRole); // admin =1 
    console.log(userReqIndex,targetUserIndex);
    const canModify = userReqIndex < targetUserIndex // false
    //                       0               1 

    if(!canModify) return next(new Error("You Can't Change This User Role!",{cause:403}));
    return next();

}