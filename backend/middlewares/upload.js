import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "provider-verification",
        allowed_formats: ["jpg", "png", "jpeg"],
        type: "authenticated",
    },
});

export const upload = multer({ storage });