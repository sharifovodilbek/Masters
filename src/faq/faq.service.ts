import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateFaqDto) {
    try {
      return await this.prisma.fAQ.create({
        data
      });
    } catch (error) {
      throw new NotFoundException('FAQ yaratishda xatolik yuz berdi');
    }
  }

  async findAll(
    filter: string,
    page: number,
    limit: number,
  ) {
    try {
      const take = limit || 10;
      const skip = page ? (page - 1) * take : 0;

      const where: any = {};
      if (filter) {
        where.question = {
          startsWith: filter,
        };
      }

      const faq = await this.prisma.fAQ.findMany({
        where,
        skip,
        take,
      });

      return faq;
    } catch (error) {
      throw new NotFoundException(`FAQni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const fAQ = await this.prisma.fAQ.findUnique({ where: { id } });
      if (!fAQ) {
        throw new NotFoundException('FAQ topilmadi');
      }
      return fAQ;
    } catch (error) {
      throw new NotFoundException('FAQ olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateFaqDto) {
    try {
      await this.findOne(id);
      return await this.prisma.fAQ.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('FAQ yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);
      await this.prisma.fAQ.delete({ where: { id } });
      return {
        message: 'FAQ o\'chirildi',
        data: x
      }
    } catch (error) {
      throw new NotFoundException('FAQ ochirishda xatolik');
    }
  }
}
