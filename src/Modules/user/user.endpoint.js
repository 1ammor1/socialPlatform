import { roles } from "../../DB/models/user.model.js";

const endPoints = {
    profile: [roles.user,roles.admin],
    updateProfile: [roles.user],
    updatePassword: [roles.user],
    deactivateAccount: [roles.user],
    updatePassword: [roles.user]
}

export default endPoints;