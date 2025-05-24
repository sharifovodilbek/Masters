import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) { }
  async create(dto: CreateSizeDto) {
    try {
      return await this.prisma.size.create({
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Size yaratishda xatolik yuz berdi');
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

      const sizes = await this.prisma.size.findMany({
        where,
        skip,
        take,
      });

      return sizes;
    } catch (error) {
      throw new NotFoundException(`Sizeni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const size = await this.prisma.size.findUnique({ where: { id } });
      if (!size) {
        throw new NotFoundException('Size topilmadi');
      }
      return size;
    } catch (error) {
      throw new NotFoundException('Size olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateSizeDto) {
    try {
      await this.findOne(id);
      return await this.prisma.size.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Size yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);
      await this.prisma.size.delete({ where: { id } });
      return {
        message: 'Size o\'chirildi',
        data: x
      }
    } catch (error) {
      throw new NotFoundException('Size ochirishda xatolik');
    }
  }
}
