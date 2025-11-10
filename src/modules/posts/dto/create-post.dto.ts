import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, ArrayUnique, IsUrl, Matches, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase kebab-case' })
  slug: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: false }, { message: 'coverImage must be a valid URL' })
  coverImage?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

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
