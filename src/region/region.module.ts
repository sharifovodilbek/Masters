import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
      JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '7d' },
      }),],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
