import { roles } from "../../DB/models/user.model.js";

export const endPoints = {
    getAll: [roles.superAdmin],
    changeRole: [roles.superAdmin,roles.admin]
}