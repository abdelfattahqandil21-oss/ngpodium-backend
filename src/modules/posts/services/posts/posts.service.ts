import { ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { CreatePostDto } from '../../dto/create-post.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
  

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, dto: CreatePostDto) {
    try {
      const data = {
        slug: dto.slug,
        title: dto.title,
        content: dto.content,
        coverImage: dto.coverImage ?? null,
        tags: dto.tags ?? [],
        author: { connect: { id: authorId } },
      };
      const post = await this.prisma.post.create({
        data,
        select: this.selectPost(),
      });
      this.logger.log(`Post created: ${post.id} by user ${authorId}`);
      return post;
    } catch (e: any) {
      this.logger.error(`Failed to create post: ${e.message}`);
      if (e?.code === 'P2002') throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async findAll(params: { page?: number; limit?: number; orderBy?: 'createdAt' | 'updatedAt' | 'title'; order?: 'asc' | 'desc'; authorId?: number; tags?: string[]; q?: string }) {
    const page = Math.max(1, Math.floor(Number(params.page ?? 1)));
    const limit = Math.min(100, Math.max(1, Math.floor(Number(params.limit ?? 20))));
    const skip = (page - 1) * limit;
    const orderByField = params.orderBy ?? 'createdAt';
    const order: 'asc' | 'desc' = params.order === 'asc' ? 'asc' : 'desc';

    const where = this.buildWhereCondition({
      authorId: params.authorId,
      tags: params.tags,
      q: params.q,
    });

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: order },
        select: this.selectPost(),
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllOffset(params: { offset?: number; limit?: number }) {
    const offset = Math.max(Number(params.offset ?? 0), 0);
    const take = Math.min(Math.max(Number(params.limit ?? 20), 1), 100);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip: offset,
        take,
        orderBy: { createdAt: 'desc' },
        select: this.selectPost(),
      }),
      this.prisma.post.count(),
    ]);

    return {
      items,
      meta: {
        total,
        offset,
        limit: take,
        hasMore: offset + items.length < total,
      },
    };
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

  private buildWhereCondition(params: { authorId?: number; tags?: string[]; q?: string }) {
    return {
      AND: [
        params.authorId ? { authorId: params.authorId } : {},
        params.tags?.length ? { tags: { hasSome: params.tags } } : {},
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
