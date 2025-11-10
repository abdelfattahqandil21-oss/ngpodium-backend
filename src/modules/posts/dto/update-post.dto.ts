import { IsArray, IsInt, IsOptional, IsPositive, IsString, ArrayUnique, IsUrl, Matches, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase kebab-case' })
  slug?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: false }, { message: 'coverImage must be a valid URL' })
  coverImage?: string;

  @IsString()
  @IsOptional()
  content?: string;

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
