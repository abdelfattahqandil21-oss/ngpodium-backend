import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
const { PrismaClient } = require('@prisma/client') as { PrismaClient: new () => any };

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
