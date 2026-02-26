import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import AWS from "aws-sdk";

import multerS3 from "multer-s3";
// import fs from "fs/promises"

import {
  BACKBLAZE_KEY_ID,
  BACKBLAZE_KEY_NAME,
  BACKBLAZE_APP_KEY,
  BACKBLAZE_REGION,
  BACKBLAZE_ENDPOINT,
  BACKBLAZE_BUCKET,
} from "./../config/config.js";

AWS.config.update({
  accessKeyId: BACKBLAZE_KEY_ID,
  secretAccessKey: BACKBLAZE_APP_KEY,
  region: BACKBLAZE_REGION,
});
const s3 = new AWS.S3({
  endpoint: BACKBLAZE_ENDPOINT,
  s3ForcePathStyle: true, // recomendado con B2 S3 compatible[web:171][web:233]
});

const storage = multerS3({
    s3,
    bucket:BACKBLAZE_BUCKET,
    acl:'private',
    key:(req,file,cb)=>{
        let folder = req.query.folder || "upload";
        let ext = file.originalname.split('.').pop();
        let base = file.originalname.split('.')[0];
        let filename = `${base}_${Date.now()}.${ext}`;
        cb(null,`${folder}/${filename}`)
    }
})

// Middleware de subida de archivos
export const upload_images = multer({ storage });



// ESTO NOS SIRVE SI QUEREMOS QUE SE GUARDE EN LOCAL
// let __filename = fileURLToPath(import.meta.url);
// let __dirname = path.dirname(__filename);
// console.log(__dirname);
// console.log(path.join(__dirname,'..','public','images','uploads','profiles'));

// const storage = multer.diskStorage({
//     //configurar el destino de donde guardar los archivos
//     destination:(req,file,cb)=>{
//         cb(null,path.join(path.join(__dirname,'..','public','uploads')))
//     }, filename:(req,file,cb)=>{ //configurar el nombre del archivo
//         const name = file.originalname.split('.')[0];
//         const ext = path.extname(file.originalname);
//         cb(null,`${name}_${Date.now()}${ext}`);
//     }
// })

// export const upload_images = multer({storage:storage});
