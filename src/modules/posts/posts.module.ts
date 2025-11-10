import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PostsController } from './controllers/posts/posts.controller';
import { PostsService } from './services/posts/posts.service';

@Module({
  imports: [CommonModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
