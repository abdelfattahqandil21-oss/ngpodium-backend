import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, ArrayUnique, IsUrl, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'my-first-post', description: 'Lowercase kebab-case unique slug' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase kebab-case' })
  slug: string;

  @ApiProperty({ example: 'My First Post' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ example: '/uploads/cover/image.jpg' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: 'This is the content of my first post...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: ['nestjs', 'prisma'] })
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
