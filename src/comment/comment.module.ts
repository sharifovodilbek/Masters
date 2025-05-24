import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
      JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '7d' },
      }),
    ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
