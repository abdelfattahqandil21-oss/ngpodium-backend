import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

// Create upload directories if they don't exist
const uploadDir = './uploads';
const profileDir = './uploads/profile';
const coverDir = './uploads/cover';

[uploadDir, profileDir, coverDir].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Allowed image types (will be converted to WebP)
const imageFileFilter = (req: any, file: Express.Multer.File, callback: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return callback(new BadRequestException('Only image files are allowed (jpg, jpeg, png, webp)'), false);
  }
  callback(null, true);
};

// Storage configuration for profile images
export const profileStorage = diskStorage({
  destination: profileDir,
  filename: (req: any, file, callback) => {
    // Get username from JWT payload (attached by JwtGuard)
    const username = req.user?.username || 'unknown';
    const ext = extname(file.originalname);
    const timestamp = Date.now();
    // Format: username-timestamp.ext (e.g., john-1731331234567.jpg)
    callback(null, `${username}-${timestamp}${ext}`);
  },
});

// Storage configuration for cover images
export const coverStorage = diskStorage({
  destination: coverDir,
  filename: (req: any, file, callback) => {
    // Get title from request body
    const title = req.body?.title || 'untitled';
    // Sanitize title: remove special chars, replace spaces with hyphens
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50); // limit length
    const ext = extname(file.originalname);
    const timestamp = Date.now();
    // Format: title-timestamp.ext (e.g., my-post-title-1731331234567.jpg)
    callback(null, `${sanitizedTitle}-${timestamp}${ext}`);
  },
});

// Multer options
export const multerOptions = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
};
