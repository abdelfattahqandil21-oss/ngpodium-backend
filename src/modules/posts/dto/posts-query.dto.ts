import { IsIn, IsInt, IsOptional, Max, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostsQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: ['createdAt', 'updatedAt', 'title'], default: 'createdAt' })
  @IsIn(['createdAt', 'updatedAt', 'title'])
  @IsOptional()
  orderBy?: 'createdAt' | 'updatedAt' | 'title' = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ description: 'Search in content, slug, title, or tags', example: 'nestjs' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ description: 'Comma-separated tags filter e.g. js,ts', example: 'js,ts' })
  @IsString()
  @IsOptional()
  tags?: string; // will be split by controller into array

  @ApiPropertyOptional({ description: 'Filter by author id', example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  authorId?: number;
}
