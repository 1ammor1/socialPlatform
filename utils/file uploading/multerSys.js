import multer, { diskStorage } from "multer";
import fs from "fs";
import path from "path";

export const fileValidtion= {
    images: ["image/png","image/jpeg","image/jpg"],
    files: ["application/pdf"]
}
export const upload = (filetype,folder)=>{
    const storage = diskStorage({
        destination: (req,file,cb)=>{
            const folderPath= path.resolve(".",`${folder}/${req.user._id}`);
            fs.mkdirSync(folderPath,{recursive: true});
            const folderName=`${folder}/${req.user._id}`;
            cb(null,folderName);
        },
        filename: (req,file,cb)=>{
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        }
    });
    const fileFilter = (req,file,cb)=>{
        if (!filetype.includes(file.mimetype))
            return cb(new Error(`Accepted mimetypes are ${JSON.stringify(filetype)} Only`), false);
        return cb(null,true);
    }
    const multerUpload = multer({storage,fileFilter});
    return multerUpload;
}