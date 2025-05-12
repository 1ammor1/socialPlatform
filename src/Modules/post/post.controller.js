import { Router } from "express";
import validation from "../../middleware/validation.middleware.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import endPoints from "./post.endpoint.js";
import {uploadCloud} from "../../../utils/file uploading/multerCloud.js";
import commentRouter from "./../comment/comment.controller.js";
import * as postService from "./post.service.js";
import * as postValidation from "./post.validation.js";
const router = Router();

router.use("/:postID/comment",commentRouter);


// create post
router.post("/",isAuthenticated,isAuthorized(endPoints.createPost),uploadCloud().array("images"),validation(postValidation.createPost),postService.createPost);
// update post
router.patch("/:id",isAuthenticated,isAuthorized(endPoints.updatePost),uploadCloud().array("images"),validation(postValidation.updatePost),postService.updatePost);
// soft delete
router.patch("/:id/freeze",isAuthenticated,isAuthorized(endPoints.freezePost),validation(postValidation.freezePost),postService.freezePost);
// restore post
router.patch("/:id/unfreeze",isAuthenticated,isAuthorized(endPoints.unfreezePost),validation(postValidation.unfreezePost),postService.unfreezePost);
// like unlike post
router.patch("/:id/like-unlike",isAuthenticated,isAuthorized(endPoints.likeAndUnlikePost),validation(postValidation.likeAndUnlikePost),postService.likeAndUnlikePost);
// get all active posts
router.get("/active",isAuthenticated,isAuthorized(endPoints.getAllActivePosts),postService.getAllActivePosts);
// get all freezed posts
router.get("/freezed",isAuthenticated,isAuthorized(endPoints.getAllFreezedPosts),postService.getAllFreezedPosts);
// get single post
router.get("/:id",isAuthenticated,isAuthorized(endPoints.getPost),validation(postValidation.getPost),postService.getPost);

export default router;