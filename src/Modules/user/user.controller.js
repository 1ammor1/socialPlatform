import { Router } from "express";
import { profile, updateUser,updateProfile,updatePassword, deactivateAccount, profilePicture, coverPictures,deleteProfilePicture} from "./user.service.js";
import isAuthenticated from "./../../middleware/authentication.middleware.js";
import {asyncHandler} from "./../../../utils/asyncHandler.js"
import endPoints from "./user.endpoint.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validation.middleware.js";
import * as userValidation from "./user.validation.js"
import { fileValidtion, upload } from "../../../utils/file uploading/multerSys.js";
import { uploadCloud } from "../../../utils/file uploading/multerCloud.js";
const router = Router();


router.get("/profile",isAuthenticated ,isAuthorized(endPoints.profile), profile);
router.patch("/profile",isAuthenticated,isAuthorized(endPoints.updateProfile),validation(userValidation.updateProfile),updateProfile);
router.patch("/password",isAuthenticated,isAuthorized(endPoints.updatePassword),validation(userValidation.updatePassword),updatePassword);
// router.post("/profile-picture",isAuthenticated,upload(fileValidtion.images,"uploads/user").single("image"),profilePicture);
router.post("/profile-picture",isAuthenticated,uploadCloud().single("image"),profilePicture);
router.delete("/profile-picture",isAuthenticated,deleteProfilePicture);

router.post("/cover-pictures",isAuthenticated,upload(fileValidtion.images).array("images"),coverPictures);

router.delete("/delete",isAuthenticated,isAuthorized(endPoints.deactivateAccount),deactivateAccount)
router.put("/:id", asyncHandler(updateUser));
export default router;