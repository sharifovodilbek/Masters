import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
      JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '7d' },
      }),],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
