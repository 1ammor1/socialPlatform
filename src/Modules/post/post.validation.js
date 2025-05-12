import joi from "joi";
import { isVaildObjectId } from "../../middleware/validation.middleware.js";


export const fileObj = {
    fieldname: joi.string().valid("images").required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    size: joi.number().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
}
export const createPost = joi.object({
    text: joi.string(),
    file: joi.array().items(joi.object(fileObj)),
}).or("file","text");

export const updatePost = joi.object({
    id: joi.any().strip(), 
    text: joi.string(),
    file: joi.array().items(joi.object(fileObj)),
}).or("file","text");

export const freezePost = joi.object({
    id: joi.custom(isVaildObjectId).required(),
});

export const unfreezePost = joi.object({
    id: joi.custom(isVaildObjectId).required(),
});

export const getPost = joi.object({
    id: joi.custom(isVaildObjectId).required(),
});

export const likeAndUnlikePost = joi.object({
    id: joi.custom(isVaildObjectId).required(),
});
export const addReply= joi.object({
    id: joi.custom(isVaildObjectId).required(),
    postID: joi.custom(isVaildObjectId).required()
})