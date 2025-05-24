import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from './session.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @UseGuards(AuthGuard)
  @Post('auto')
  async createAuto(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.sessionService.createAutoSession(req, userId);
  }

}
