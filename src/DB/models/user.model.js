import { model ,Schema } from "mongoose";

export const gender = {
    male: "male",
    female: "female"
}
export const roles = {
    superAdmin: "superadmin",
    admin: "admin",
    user: "user",
    
}
export const defaultProfilePicture = "uploads\\default-avatar-icon-of-social-media-user-vector.jpg";
const userSchema = new Schema(
    {
        name: {type: String, minLength: 3 , maxLength: 40 ,required: true},
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        },
        password: {type: String, required: true},
        // profilePicture: {type: String , default: defaultProfilePicture},
        proflePicture: {secure_url: {type:String,default:"https://res.cloudinary.com/dgejlb6lx/image/upload/v1746308084/default-avatar-icon-of-social-media-user-vector_lyag02.jpg"} , public_id: {type:String,default:"default-avatar-icon-of-social-media-user-vector_lyag02"}},
        coverPictures: [String],
        isActivated: {type: Boolean, default:false},
        role: {type: String, enum: Object.values(roles), default: roles.user},
        isLoggedIn: {type: Boolean, default:false},
        freezed: {type: Boolean, default:false}
    }
);

const User = model("User", userSchema);

export default User