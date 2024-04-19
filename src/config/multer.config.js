import multer from "multer"
import __dirname from "../utils.js"

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,`${__dirname}/files`)
    },
    filename:function(req,file,cb){
        console.log(file)
        cb(null, `${Date.now()}-${file.originalname}`)
    },
});

export const uploader = multer({storage})