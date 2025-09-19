import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
   folder: 'social_media_app',
   allowed_format: ['jpg', 'jpeg', 'png', 'mp4', 'mov']
  }
})

const upload = multer({ storage})

export default upload