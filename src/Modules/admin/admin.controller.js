import { Router } from "express";
import  isAuthenticated  from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import {asyncHandler} from "../../../utils/asyncHandler.js";
import {endPoints} from "./admin.endpoint.js";
import * as adminService from "./admin.service.js";
import { canChangeRole } from "./admin.middleware.js";

const router = Router();
// get all users and posts
router.get("/",isAuthenticated,isAuthorized(endPoints.getAll),asyncHandler(adminService.getAll));
// change role
router.patch("/role",isAuthenticated,isAuthorized(endPoints.changeRole),canChangeRole,asyncHandler(adminService.changeRole)); 
export default router;