import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createAutoSession(req: Request, userId: number) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip;
    const device = req.headers['user-agent'] || 'Unknown';

    return this.prisma.session.create({
      data: {
        userId,
        device,
        ip,
      },
    });
  }
}
