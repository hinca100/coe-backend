import { v2 as cloudinary } from "cloudinary";

export const CloudinaryProvider = {
  provide: "Cloudinary",
  useFactory: () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("🚀 Cloudinary conectado con:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY?.slice(0, 5) + "****",
    });

    return cloudinary;
  },
};