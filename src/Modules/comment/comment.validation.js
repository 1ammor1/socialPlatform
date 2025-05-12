import joi from "joi";
import { fileObj } from "../post/post.validation.js";
import { isVaildObjectId } from "../../middleware/validation.middleware.js";

export const createComment = joi.object({
    postID: joi.custom(isVaildObjectId).required(),
    text: joi.string(),
    file: joi.array().items(joi.object(fileObj)),
}).or("file","text");

export const updateComment = joi.object({
    commentID: joi.custom(isVaildObjectId).required(),
    text: joi.string(),
    file: joi.array().items(joi.object(fileObj)),
}).or("file","text");

export const freezeComment = joi.object({
    commentID: joi.custom(isVaildObjectId).required(),
});

export const unfreezeComment = joi.object({
    commentID: joi.custom(isVaildObjectId).required(),
});

export const getComments = joi.object({
    postID: joi.custom(isVaildObjectId).required(),
});

export const likeAndUnlikeComment = joi.object({
    id: joi.custom(isVaildObjectId).required(),
});

export const addReply = joi.object({
    commentID: joi.custom(isVaildObjectId).required(),
    postID: joi.custom(isVaildObjectId).required(),
    text: joi.string(),
    file: joi.array().items(joi.object(fileObj)),
});

export const hardDeleteComment = joi.object({
    commentID: joi.custom(isVaildObjectId).required(),
});