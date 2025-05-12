import multer, { diskStorage } from "multer";
import fs from "fs";
import path from "path";

export const fileValidtion= {
    images: ["image/png","image/jpeg","image/jpg"],
    files: ["application/pdf"]
}
export const uploadCloud = (filetype,folder)=>{
    const storage = diskStorage({});

    const multerUpload = multer({storage});
    return multerUpload;
}