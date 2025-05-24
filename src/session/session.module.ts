import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
   imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
