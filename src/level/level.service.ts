import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateLevelDto) {
    try {
      return await this.prisma.level.create({
        data
      });
    } catch (error) {
      throw new NotFoundException('Level yaratishda xatolik yuz berdi');
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

      const levels = await this.prisma.level.findMany({
        where,
        skip,
        take,
        include: {
          products: true,
        }
      });

      return levels;
    } catch (error) {
      throw new NotFoundException(`Levelni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const level = await this.prisma.level.findUnique({ where: { id } });
      if (!level) {
        throw new NotFoundException('Level topilmadi');
      }
      return level;
    } catch (error) {
      throw new NotFoundException('Level olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateLevelDto) {
    try {
      await this.findOne(id);
      return await this.prisma.level.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Level yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);
      await this.prisma.level.delete({ where: { id } });
      return {
        message: 'Level o\'chirildi',
        data: x
      }
    } catch (error) {
      throw new NotFoundException('Level ochirishda xatolik');
    }
  }
}
