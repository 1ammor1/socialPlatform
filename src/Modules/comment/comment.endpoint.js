import { roles } from "../../DB/models/user.model.js";

export const endPoints={
    createComment:[roles.user],
    updateComment:[roles.user],
    freezeComment:[roles.user,roles.admin],
    unfreezeComment:[roles.user,roles.admin],
    getComments:[roles.user,roles.admin],
    likeAndUnlikeComment:[roles.user],
    addReply:[roles.user],
    hardDeleteComment:[roles.user,roles.admin]
}