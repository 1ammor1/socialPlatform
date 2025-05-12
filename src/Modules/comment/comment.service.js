import { roles } from "../../DB/models/user.model.js";
import {asyncHandler} from "./../../../utils/asyncHandler.js"
import cloudinary from "./../../../utils/file uploading/cloudinary.config.js"
import Comment from "./../../DB/models/comment.model.js"
import Post from "./../../DB/models/post.model.js"

export const createComment = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { postID } = req.params;
    if(req.file)
    {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `SOCIALAPP/users/${req.user._id}/posts/${postID}/comments`,
        });
        const comment = await Comment.create({ text, post: postID, user: req.user._id, image: { secure_url, public_id } });
        return res.json({ success: true, results: { comment } });
    }
    const comment = await Comment.create({ text, post: postID, user: req.user._id });
    return res.json({ success: true, results: { comment } });
});

export const updateComment = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const {commentID} = req.params;
    const comment = await Comment.findOne({ _id: commentID, isDeleted: false});
    if(!comment) return next(new Error("Comment Not Found!",{cause:404}));
    const post = await Post.findById({_id: comment.post,isDeleted: false});
    if(!post) return next(new Error("Post Not Found!",{cause:404}));

    if (comment.user.toString() !== req.user._id.toString()) return next(new Error("You Are Not Allowed To Update This Comment!",{cause:403}));
    if(req.file)
    {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `SOCIALAPP/users/${req.user._id}/posts/${post._id}/comments`,
        });
        image = { secure_url, public_id };
        if(comment.image)
        {
            await cloudinary.uploader.destroy(comment.image.public_id);
        }
        comment.image = image;
    }
    comment.text = text ? text : comment.text;
    await comment.save();
    return res.json({ success: true, results: { comment } });
});

export const freezeComment = asyncHandler(async (req, res, next) => {
    const {commentID} = req.params;
    const comment = await Comment.findOne({ _id: commentID, isDeleted: false});
    if(!comment) return next(new Error("Comment Not Found!",{cause:404}));
    console.log (comment.user.toString(),req.user._id.toString());
    if(comment.user.toString() !== req.user._id.toString() || req.user.role == roles.admin) return next(new Error("You Are Not Allowed To Update This Comment!",{cause:403}));
    comment.isDeleted = true;
    comment.deletedBy = req.user._id;
    await comment.save();
    return res.json({ success: true, results: { comment } });
});

export const unfreezeComment = asyncHandler(async (req, res, next) => {
    const {commentID} = req.params;
    const comment = await Comment.findOneAndUpdate({ _id: commentID, isDeleted: true},{isDeleted: false,$unset: {deletedBy: null}},{new: true,runValidators: true});
    if(!comment) return next(new Error("Comment Not Found!",{cause:404}));
    return res.json({ success: true, results: { comment } });
});

export const getComments = asyncHandler(async (req, res, next) => {
    const {postID} = req.params;
    const post = await Post.findOne({ _id: postID, isDeleted: false});
    if(!post) return next(new Error("Post Not Found!",{cause:404})); 
    const comments = await Comment.find({ post: postID, isDeleted: false, parentComment: {$exists: false} }).populate("replies");
    return res.json({ success: true, results: { comments } });

});

export const likeAndUnlikeComment = asyncHandler(async (req,res,next)=>{
    const {id}= req.params;
    const comment = await Comment.findById(id);
    if(!comment) return next(new Error("Comment Not Found!",{cause:404}));
    if(comment.likes.includes(req.user._id))
    {
        comment.likes.pull(req.user._id);
        await comment.save();
        return res.json({success:true, results: {comment}});
    }
    else
    {
        comment.likes.push(req.user._id);
        await comment.save();
        return res.json({success:true, results: {comment}});
    }

});

export const addReply = asyncHandler(async (req,res,next)=>{
    const {postID ,commentID}= req.params;
    const post = await Post.findOne({_id: postID, isDeleted: false});
    if(!post) return next(new Error("Post not found"),{cause: 404});
    const comment = await Comment.findOne({_id: commentID, post: postID, isDeleted: false});
    if(!comment) return next(new Error("Comment not found"),{cause: 404});

    let image
    if(req.file)
    {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `SOCIALAPP/users/${req.user._id}/posts/${postID}/comments/${comment._id}`,
        });
        
        image= {secure_url,public_id};
    }
    const reply = await Comment.create({
        ...req.body,
        image,
        user: req.user._id,
        post: postID,
        parentComment: comment._id
    });
    return res.json({success:true , results:{reply}});
}); 

export const hardDeleteComment = asyncHandler(async (req, res, next) => {
    const {commentID} = req.params;
    const comment = await Comment.findOne({ _id: commentID, isDeleted: false});
    if(!comment) return next(new Error("Comment Not Found!",{cause:404}));
    console.log (comment.user.toString(),req.user._id.toString());
    if(comment.user.toString() !== req.user._id.toString() || req.user.role == roles.admin) return next(new Error("You Are Not Allowed To Delete This Comment!",{cause:403}));
    await comment.deleteOne();
    return res.json({ success: true, results: { comment } });
});