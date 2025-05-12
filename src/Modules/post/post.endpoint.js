import {roles} from "../../DB/models/user.model.js";

const endPoints={
    createPost:[roles.user],
    updatePost:[roles.user],
    freezePost:[roles.user,roles.admin],
    unfreezePost:[roles.user,roles.admin],
    getPost:[roles.user,roles.admin],
    getAllActivePosts:[roles.user,roles.admin],
    getAllFreezedPosts:[roles.user,roles.admin],
    likeAndUnlikePost:[roles.user]
}

export default endPoints