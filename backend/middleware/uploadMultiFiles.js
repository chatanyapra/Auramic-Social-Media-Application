// backend/middleware/fileUpload.js

import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const uploadDir = path.resolve('backend/uploads/');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Restrict MIME types to images and videos
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'));
  }
};

// Base multer config (allows up to 4 files for validation purposes)
const baseUpload = multer({ storage, fileFilter }).array('files', 4); // Max 4 to allow error on 4+ images

// Custom middleware to validate image/video rules
const uploadWithValidation = (req, res, next) => {
  baseUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const files = req.files || [];

    const videoFiles = files.filter(f => f.mimetype.startsWith('video/'));
    const imageFiles = files.filter(f => f.mimetype.startsWith('image/'));

    if (videoFiles.length > 1) {
      // Delete uploaded files
      files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: 'Only one video can be uploaded at a time.' });
    }

    if (videoFiles.length === 1 && imageFiles.length > 0) {
      files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: 'Cannot upload both image(s) and video at the same time.' });
    }

    if (imageFiles.length > 3) {
      files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: 'You can upload a maximum of 3 images.' });
    }

    // All validations passed
    next();
  });
};

export default uploadWithValidation;
