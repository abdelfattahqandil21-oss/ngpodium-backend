import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { UpdateUserDto } from '../../../users/dto/update-user.dto';
import { CreateUserAdminDto } from '../../../users/dto/create-user-admin.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserAdminDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        image: dto.image,
        nickname: dto.nickname,
        phone: dto.phone,
        password: hash,
      },
      select: { id: true, username: true, email: true, image: true, nickname: true, phone: true, createdAt: true, updatedAt: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, email: true, image: true, nickname: true, phone: true, createdAt: true, updatedAt: true },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, image: true, nickname: true, phone: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const { username, nickname, email, image, phone } = dto;
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          username,
          nickname,
          email,
          image,
          phone,
        },
        select: { id: true, username: true, email: true, image: true, nickname: true, phone: true, createdAt: true, updatedAt: true },
      });
    } catch (e: any) {
      if (e?.code === 'P2025') throw new NotFoundException('User not found');
      throw e;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: { id: true, username: true, email: true },
      });
    } catch (e: any) {
      if (e?.code === 'P2025') throw new NotFoundException('User not found');
      throw e;
    }
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, email: true, image: true, nickname: true, phone: true, createdAt: true, updatedAt: true },
    });
  }

  findUserPosts(userId: number, query?: { page?: number; limit?: number; orderBy?: 'createdAt' | 'updatedAt' | 'title'; order?: 'asc' | 'desc' }) {
    const page = Number(query?.page ?? 1);
    const limit = Math.min(Number(query?.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const orderByField = query?.orderBy ?? 'createdAt';
    const order: Prisma.SortOrder = query?.order === 'asc' ? 'asc' : 'desc';

    return this.prisma.post.findMany({
      where: { authorId: userId },
      skip,
      take: limit,
      orderBy: { [orderByField]: order },
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      },
    });
  }
}
