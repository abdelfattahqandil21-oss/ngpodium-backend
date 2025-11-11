import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PostsOffsetQueryDto {
  @ApiPropertyOptional({ description: 'Number of records to skip', default: 0, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ description: 'Maximum records to return', default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
