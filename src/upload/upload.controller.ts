import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../modules/auth/guards/jwt.guard';
import { UploadService } from './upload.service';
import { profileStorage, coverStorage, multerOptions } from './multer.config';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @UseInterceptors(FileInterceptor('file', { storage: profileStorage, ...multerOptions }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // Process and convert to WebP
    const processed = await this.uploadService.processImage(file, 'profile');
    const url = this.uploadService.getFileUrl(processed.filename, 'profile');
    
    return {
      filename: processed.filename,
      url,
      originalSize: file.size,
      mimetype: 'image/webp',
    };
  }

  @Post('cover')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @UseInterceptors(FileInterceptor('file', { storage: coverStorage, ...multerOptions }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
          description: 'Title for the cover image (used in filename)',
          example: 'My Post Title',
        },
      },
      required: ['file'],
    },
  })
  async uploadCoverImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // Process and convert to WebP
    const processed = await this.uploadService.processImage(file, 'cover');
    const url = this.uploadService.getFileUrl(processed.filename, 'cover');
    
    return {
      filename: processed.filename,
      url,
      originalSize: file.size,
      mimetype: 'image/webp',
    };
  }
}
