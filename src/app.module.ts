import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    PostsModule,
    UploadModule,
    HealthModule,
  ],
})
export class AppModule {}
