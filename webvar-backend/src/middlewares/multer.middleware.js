import multer from "multer";

export const allowedExtensions = {
    image: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
};

export const multerMiddleHost = ({
    extensions = allowedExtensions.image,
} = {}) => {
    const storage = multer.diskStorage({}); // use memory storage

    const fileFilter = (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        if (extensions.includes(ext)) {
            return cb(null, true);
        }
        cb(new Error('File format is not allowed!'), false);
    };

    const upload = multer({ storage, fileFilter });
    return upload;
};
