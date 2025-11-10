import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayNotEmpty, ArrayUnique, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  postSlug: string;

  @IsString()
  @IsNotEmpty()
  postTitle: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: false }, { message: 'postCoveredImg must be a valid URL' })
  postCoveredImg?: string;

  @IsString()
  @IsNotEmpty()
  postContent: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @IsOptional()
  postTags?: string[];
}
