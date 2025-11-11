import { IsArray, IsInt, IsOptional, IsPositive, IsString, ArrayUnique, IsUrl, Matches, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'my-first-post-updated' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase kebab-case' })
  slug?: string;

  @ApiPropertyOptional({ example: 'My First Post (Edited)' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({ example: '/uploads/cover/image.jpg' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ example: 'Edited content for the post...' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: ['nestjs', 'prisma', 'tips'] })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @IsPositive()
  @IsOptional()
  authorId?: number;
}
