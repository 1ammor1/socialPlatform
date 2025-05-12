import { Router } from "express";
import validation from "../../middleware/validation.middleware.js";
import {endPoints} from "./comment.endpoint.js";
import * as commentValidation from "./comment.validation.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import {uploadCloud} from "../../../utils/file uploading/multerCloud.js";
import * as commentService from "./comment.service.js";

const router  = Router({mergeParams:true, strict:true});

// create comment
router.post("/",isAuthenticated,isAuthorized(endPoints.createComment),uploadCloud().single("images"),validation(commentValidation.createComment),commentService.createComment);
// get comments of post
router.get("/",isAuthenticated,isAuthorized(endPoints.getComments),validation(commentValidation.getComments),commentService.getComments);
// soft delete
router.patch("/:commentID/freeze",isAuthenticated,isAuthorized(endPoints.freezeComment),validation(commentValidation.freezeComment),commentService.freezeComment);
// restore comment
router.patch("/:commentID/unfreeze",isAuthenticated,isAuthorized(endPoints.unfreezeComment),validation(commentValidation.unfreezeComment),commentService.unfreezeComment);
// like unlike comment
router.patch("/:id/like-unlike",isAuthenticated,isAuthorized(endPoints.likeAndUnlikeComment),validation(commentValidation.likeAndUnlikeComment),commentService.likeAndUnlikeComment);
// update comment
router.patch("/:commentID",isAuthenticated,isAuthorized(endPoints.updateComment),uploadCloud().single("images"),validation(commentValidation.updateComment),commentService.updateComment);
// add reply
router.post("/:commentID/reply",isAuthenticated,isAuthorized(endPoints.addReply),validation(commentValidation.addReply),commentService.addReply);
// delete comment
router.delete("/:commentID",isAuthenticated,isAuthorized(endPoints.hardDeleteComment),validation(commentValidation.hardDeleteComment),commentService.hardDeleteComment);
export default router;