import { Schema , model} from "mongoose";


const commentSchema = new Schema({
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type:String , required: function(){
        return this.image? false : true;
    }},
    image: {secure_url: String , public_id: String},
    deletedBy: {type: Schema.Types.ObjectId, ref: "User"},
    isDeleted: {type: Boolean, default: false},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    parentComment: {type: Schema.Types.ObjectId, ref: "Comment"},
},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

commentSchema.virtual("replies",{
    ref: "Comment", // the model to use
    localField: "_id", // PK
    foreignField: "parentComment" // FK
})

// hooks
commentSchema.post("deleteOne",{query: true, document: false}, async function(doc,next){
    if(doc.image.secure_url)
    {
        await cloudinary.uploader.destroy(doc.image.public_id);
    }
    const parentComment = doc._id;
    const replies = await this.constructor.find({parentComment});
    if(replies.length)
    {
        for (const reply of replies) {
            await reply.deleteOne();
        }
    }
    return next();
})
const Comment = model("Comment", commentSchema);
export default Comment;