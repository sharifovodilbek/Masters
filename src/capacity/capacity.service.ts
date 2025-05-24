import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateCapacityDto) {
    try {
      return await this.prisma.capacity.create({
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Capacity yaratishda xatolik yuz berdi');
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

      const capacities = await this.prisma.capacity.findMany({
        where,
        skip,
        take,
      });

      return capacities;
    } catch (error) {
      throw new NotFoundException(`Capacityni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const capacity = await this.prisma.capacity.findUnique({ where: { id } });
      if (!capacity) {
        throw new NotFoundException('Capacity topilmadi');
      }
      return capacity;
    } catch (error) {
      throw new NotFoundException('Capacity olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateCapacityDto) {
    try {
      await this.findOne(id);
      return await this.prisma.capacity.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Capacity yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x =await this.findOne(id);
      await this.prisma.capacity.delete({ where: { id } });
      return {
        message:'Capacity o\'chirildi',
        data:x

      }
    } catch (error) {
      throw new NotFoundException('Capacity ochirishda xatolik');
    }
  }
}
