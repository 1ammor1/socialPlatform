import joi from "joi";
import { isVaildObjectId } from "../../middleware/validation.middleware.js";

export const changeRole = joi.object({
    userID: joi.custom(isVaildObjectId).required(),
})