import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';
import sharp from 'sharp';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {}

  async processImage(
    file: Express.Multer.File,
    type: 'profile' | 'cover',
  ): Promise<{ filename: string; path: string }> {
    // Generate WebP filename (replace extension with .webp)
    const originalName = file.filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    const webpFilename = `${originalName}.webp`;
    const outputPath = join('./uploads', type, webpFilename);

    // Convert to WebP with optimization
    await sharp(file.path)
      .webp({
        quality: 85, // Good balance between quality and size
        effort: 6,   // Compression effort (0-6, higher = better compression)
      })
      .resize(
        type === 'profile' ? 500 : 1200, // Profile: 500px, Cover: 1200px max width
        type === 'profile' ? 500 : 630,  // Profile: 500px, Cover: 630px max height
        {
          fit: 'inside',      // Maintain aspect ratio
          withoutEnlargement: true, // Don't upscale small images
        },
      )
      .toFile(outputPath);

    // Delete original file after conversion
    try {
      unlinkSync(file.path);
    } catch (error) {
      console.error('Error deleting original file:', error);
    }

    return {
      filename: webpFilename,
      path: outputPath,
    };
  }

  getFileUrl(filename: string, type: 'profile' | 'cover'): string {
    const baseUrl = this.config.get<string>('BASE_URL') || 'http://localhost:3000';
    return `${baseUrl}/uploads/${type}/${filename}`;
  }

  deleteFile(filepath: string): void {
    try {
      unlinkSync(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  extractFilename(url: string): string | null {
    const match = url.match(/\/uploads\/(profile|cover)\/(.+)$/);
    return match ? match[2] : null;
  }

  getFilePath(url: string): string | null {
    const match = url.match(/\/uploads\/(profile|cover)\/(.+)$/);
    if (!match) return null;
    return `./uploads/${match[1]}/${match[2]}`;
  }
}
