import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtGuard } from '../../../auth/guards/jwt.guard';
import { PostsService } from '../../services/posts/posts.service';
import { CreatePostDto } from '../../dto/create-post.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { PostsQueryDto } from '../../dto/posts-query.dto';
import { PostsOffsetQueryDto } from '../../dto/posts-offset-query.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create post (author = current user)' })
  @ApiBody({ type: CreatePostDto })
  create(@Req() req: Request, @Body() dto: CreatePostDto) {
    const userId = (req.user as any).sub as number;
    return this.posts.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List posts with search/filter/sort' })
  findAll(@Query() q: PostsQueryDto) {
    const tagsArr = q.tags ? q.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined;
    return this.posts.findAll({
      page: q.page,
      limit: q.limit,
      orderBy: q.orderBy,
      order: q.order,
      authorId: q.authorId,
      tags: tagsArr,
      q: q.q,
    });
  }

  @Get('feed')
  @ApiOperation({ summary: 'List posts using offset/limit pagination' })
  feed(@Query() query: PostsOffsetQueryDto) {
    return this.posts.findAllOffset(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get post by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.posts.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update post (owner only)' })
  @ApiBody({ type: UpdatePostDto })
  update(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Body() dto: UpdatePostDto) {
    const userId = (req.user as any).sub as number;
    return this.posts.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete post (owner only)' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).sub as number;
    return this.posts.remove(id, userId);
  }
}
