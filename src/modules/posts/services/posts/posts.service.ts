import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { CreatePostDto } from '../../dto/create-post.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, dto: CreatePostDto) {
    try {
      const data: Prisma.PostCreateInput = {
        slug: dto.slug,
        title: dto.title,
        content: dto.content,
        coverImage: dto.coverImage ?? null,
        tags: dto.tags ?? [],
        author: { connect: { id: authorId } },
      };
      return await this.prisma.post.create({
        data,
        select: this.selectPost(),
      });
    } catch (e: any) {
      if (e?.code === 'P2002') throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async findAll(params: { page?: number; limit?: number; orderBy?: 'createdAt' | 'updatedAt' | 'title'; order?: 'asc' | 'desc'; authorId?: number; tags?: string[]; q?: string }) {
    const page = Number(params.page ?? 1);
    const limit = Math.min(Number(params.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const orderByField = params.orderBy ?? 'createdAt';
    const order: Prisma.SortOrder = params.order === 'asc' ? 'asc' : 'desc';

    const where: Prisma.PostWhereInput = {
      AND: [
        params.authorId ? { authorId: params.authorId } : {},
        params.tags && params.tags.length ? { tags: { hasSome: params.tags } } : {},
        params.q
          ? {
              OR: [
                { content: { contains: params.q, mode: 'insensitive' } },
                { slug: { contains: params.q, mode: 'insensitive' } },
                { tags: { has: params.q } },
                { title: { contains: params.q, mode: 'insensitive' } },
                { author: { username: { contains: params.q, mode: 'insensitive' } } },
                { author: { nickname: { contains: params.q, mode: 'insensitive' } } },
              ],
            }
          : {},
      ],
    };

    return this.prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderByField]: order },
      select: this.selectPost(),
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug }, select: this.selectPost() });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, authorId: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id }, select: { id: true, authorId: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== authorId) throw new ForbiddenException('Not allowed');
    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          slug: dto.slug,
          title: dto.title,
          content: dto.content,
          coverImage: dto.coverImage,
          tags: dto.tags,
        },
        select: this.selectPost(),
      });
    } catch (e: any) {
      if (e?.code === 'P2002') throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async remove(id: number, authorId: number) {
    const post = await this.prisma.post.findUnique({ where: { id }, select: { id: true, authorId: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== authorId) throw new ForbiddenException('Not allowed');
    return this.prisma.post.delete({ where: { id }, select: this.selectPost() });
  }

  private selectPost() {
    return {
      id: true,
      slug: true,
      title: true,
      content: true,
      coverImage: true,
      tags: true,
      authorId: true,
      author: {
        select: {
          id: true,
          username: true,
          nickname: true,
          image: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    } as const;
  }
}
