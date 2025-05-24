import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateRegionDto) {
    try {
      return await this.prisma.region.create({
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Region yaratishda xatolik yuz berdi');
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

      const regions = await this.prisma.region.findMany({
        where,
        skip,
        take,
      });

      return regions;
    } catch (error) {
      throw new NotFoundException(`Regionlarni olishda xatolik`);
    }
  }


  async findOne(id: number) {
    try {
      const region = await this.prisma.region.findUnique({ where: { id } });
      if (!region) {
        throw new NotFoundException('Region topilmadi');
      }
      return region;
    } catch (error) {
      throw new NotFoundException('Regionni olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateRegionDto) {
    try {
      await this.findOne(id);
      return await this.prisma.region.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Regionni yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x= await this.findOne(id);
      await this.prisma.region.delete({ where: { id } });
      return {
        message: 'Region o\'chirildi',
        data: x,
      }
    } catch (error) {
      console.log(error);
      
      throw new NotFoundException('Regionni ochirishda xatolik');
    }
  }
}
