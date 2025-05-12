import { Schema , model, Types} from "mongoose";



const postSchema = new Schema({
    text: {type: String,minLength: 2, required: function(){return this.images.length ? false : true}},
    images: [{secure_url:String} , {public_id:String}],
    user: {type: Types.ObjectId , ref: "User", required: true},
    likes: [{type: Types.ObjectId , ref: "User"}],
    isDeleted: {type: Boolean , default: false},
    deletedBy: {type: Types.ObjectId , ref: "User"},
    cloudFolder: {type: String, required: function(){return this.images.length ? true : false}},
},
{timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}},)

postSchema.virtual("comments",{
    ref: "Comment", // the model to use
    localField: "_id", // PK
    foreignField: "post" // FK
})
const Post = model("Post", postSchema);
export default Post;