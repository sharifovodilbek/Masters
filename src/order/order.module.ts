import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { TgModule } from 'src/telegram/tg.module';

@Module({
  imports: [
      JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '7d' },
      }),TgModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
