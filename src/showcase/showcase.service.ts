import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateShowcaseDto) {
    try {
      return await this.prisma.showcase.create({
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Showcase yaratishda xatolik yuz berdi');
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
        where.name_uz = {
          startsWith: filter,
        };
      }

      const showcases = await this.prisma.showcase.findMany({
        where,
        skip,
        take,
      });

      return showcases;
    } catch (error) {
      throw new NotFoundException(`Showcaseni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const showcase = await this.prisma.showcase.findUnique({ where: { id } });
      if (!showcase) {
        throw new NotFoundException('Showcase topilmadi');
      }
      return showcase;
    } catch (error) {
      throw new NotFoundException('Showcase olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateShowcaseDto) {
    try {
      await this.findOne(id);
      return await this.prisma.showcase.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Showcase yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);
      await this.prisma.showcase.delete({ where: { id } });
      return {
        message: 'Showcase o\'chirildi',
        data: x
      }
    } catch (error) {
      throw new NotFoundException('Showcase ochirishda xatolik');
    }
  }
}
