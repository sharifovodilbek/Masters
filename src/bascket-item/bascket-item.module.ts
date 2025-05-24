import { Module } from '@nestjs/common';
import { BascketItemService } from './bascket-item.service';
import { BascketItemController } from './bascket-item.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '7d' },
        }),],
  controllers: [BascketItemController],
  providers: [BascketItemService],
})
export class BascketItemModule {}
