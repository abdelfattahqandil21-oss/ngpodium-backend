import { IsArray, IsOptional, IsString, ArrayUnique, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  postSlug?: string;

  @IsString()
  @IsOptional()
  postTitle?: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: false }, { message: 'postCoveredImg must be a valid URL' })
  postCoveredImg?: string;

  @IsString()
  @IsOptional()
  postContent?: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @IsOptional()
  postTags?: string[];
}
