import { roles } from "../../DB/models/user.model.js";
import { asyncHandler } from "./../../../utils/asyncHandler.js";
import cloudinary from "./../../../utils/file uploading/cloudinary.config.js";
import Post from "./../../DB/models/post.model.js";
import Comment from "../../DB/models/comment.model.js";
import { nanoid } from "nanoid";

export const createPost = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  let images = [];
  let cloudFolder;
  if (req.files.images) {
    for (const file of req.files) {
      cloudFolder = nanoid();
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `SOCIALAPP/users/${req.user._id}/posts/${cloudFolder}` }
      );
      images.push({ secure_url, public_id });
    }
  }
  const post = await Post.create({
    text,
    images,
    cloudFolder,
    user: req.user._id,
  });
  res.json({ success: true, results: { post } });
});

// export const updatePost = asyncHandler(async (req,res,next)=>{

//     const {id}= req.params;
//     const {text}= req.body;
//     const post = await Post.findById(id,{user: req.user._id});
//     if(!post) return next(new Error("Post Not Found!",{cause:404}));

//     let images=[];
//     if(req.files.images)
//     {
//         for(const file of req.files)
//         {
//             cloudFolder = nanoid();
//             const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder: `SOCIALAPP/users/${req.user._id}/posts/${post.cloudFolder}`});
//             images.push({secure_url,public_id});
//         }
//         if(post.images.length)
//         {
//             for(const image of post.images)
//             {
//                 await cloudinary.uploader.destroy(image.public_id);
//             }
//         }
//         post.images= images;
//     }
//     post.text = text ? text : post.text;
//     await post.save();
//     res.json({success:true, results: {post}})
// });

export const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;

  const post = await Post.findById(id, { user: req.user._id });
  if (!post) return next(new Error("Post Not Found!", { cause: 404 }));

  let images = [];
  let hasImages = Array.isArray(req.files) && req.files.length > 0;

  if (hasImages) {
    const cloudFolder = nanoid(); // unique folder for new images

    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `SOCIALAPP/users/${req.user._id}/posts/${cloudFolder}`,
        }
      );
      images.push({ secure_url, public_id });
    }

    // Delete old images from Cloudinary
    if (Array.isArray(post.images) && post.images.length > 0) {
      for (const image of post.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    post.images = images;
    post.cloudFolder = cloudFolder;
  }

  if (text) {
    post.text = text;
  }

  // ✅ Ensure images is always an array before save
  if (!Array.isArray(post.images)) post.images = [];

  // ✅ Final validation
  if (!post.text && post.images.length === 0) {
    return next(new Error("Post must have text or image", { cause: 400 }));
  }

  await post.save();

  res.json({ success: true, results: { post } });
});

export const freezePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new Error("Post Not Found!", { cause: 404 }));
  if (
    post.user._id.toString() == req.user._id.toString() ||
    req.user.role == "admin"
  ) {
    post.isDeleted = true;
    post.deletedBy = req.user._id;
    await post.save();
    return res.json({ success: true, results: { post } });
  } else {
    return next(new Error("Unauthorized!", { cause: 403 }));
  }
});

export const unfreezePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOneAndUpdate(
    { _id: id, isDeleted: true },
    { isDeleted: false, $unset: { deletedBy: null } },
    { new: true, runValidators: true }
  );
  if (!post) return next(new Error("Post Not Found!", { cause: 404 }));
  return res.json({ success: true, results: { post } });
});

export const getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, isDeleted: false }).populate([
    { path: "user", select: "name profilePicture.secure_url " },
    { path: "comments", select: "text user likes createdAt -_id -post",match: {parentComment:{$exists: false},isDeleted: false} , populate:{path:"user",select:"name profilePicture.secure_url"}},
  ]);
  if (!post) return next(new Error("Post Not Found!", { cause: 404 }));

  return res.json({ success: true, resunlts: { post } });
});

export const getAllActivePosts = asyncHandler(async (req, res, next) => {
  let posts;
  if (req.user.role == roles.admin) {
    posts = await Post.find({ isDeleted: false }).populate([
      { path: "user", select: "username profilePicture.secure_url" },
      { path: "comments", select: "text user likes createdAt -_id -post " },
    ]);
  } else if (req.user.role == roles.user) {
    posts = await Post.find({ user: req.user._id }).populate([
      { path: "user", select: "username profilePicture.secure_url" },
      { path: "comments", select: "text user likes createdAt -_id -post " },
    ]);
  } else {
    return next(new Error("Unauthorized!", { cause: 403 }));
  }
  return res.json({ success: true, results: { posts } });
});

export const getAllFreezedPosts = asyncHandler(async (req, res, next) => {
  let posts;
  if (req.user.role == roles.admin) {
    posts = await Post.find({ isDeleted: true }).populate([
      { path: "user", select: "username profilePicture.secure_url" },
      { path: "comments", select: "text user likes createdAt -_id -post " },
    ]);
  } else if (req.user.role == roles.user) {
    posts = await Post.find({ isDeleted: true, user: req.user._id }).populate([
      { path: "user", select: "username profilePicture.secure_url" },
      { path: "comments", select: "text user likes createdAt -_id -post " },
    ]);
  }
  return res.json({ success: true, results: { posts } });
});
export const likeAndUnlikePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new Error("Post Not Found!", { cause: 404 }));
  if (post.likes.includes(req.user._id)) {
    post.likes.pull(req.user._id);
    await post.save();
    return res.json({ success: true, results: { post } });
  } else {
    post.likes.push(req.user._id);
    await post.save();
    return res.json({ success: true, results: { post } });
  }
});
