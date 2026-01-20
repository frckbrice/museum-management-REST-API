import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinary.config';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'gallery',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadSingleImage = upload.single('image');
    
// Use Express.Multer.File type for the file parameter
export const getImageUrl = (file: Express.Multer.File) => {
    return (file as any).secure_url; // Cloudinary adds secure_url to the file object
};
