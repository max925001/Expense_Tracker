import { config } from 'dotenv';
config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath.path, {
      resource_type: 'auto',
    });

   
    fs.unlinkSync(localFilePath.path);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath.path);
    return null;
  }
};

export { uploadOnCloudinary };