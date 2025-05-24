import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateBrandDto) {
    try {
      return await this.prisma.brand.create({
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Brand yaratishda xatolik yuz berdi');
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

      const brands = await this.prisma.brand.findMany({
        where,
        skip,
        take,
      });

      return brands;
    } catch (error) {
      throw new NotFoundException(`Brandni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const brand = await this.prisma.brand.findUnique({ where: { id } });
      if (!brand) {
        throw new NotFoundException('Brand topilmadi');
      }
      return brand;
    } catch (error) {
      throw new NotFoundException('Brand olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateBrandDto) {
    try {
      await this.findOne(id);
      return await this.prisma.brand.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Brand yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const brand = await this.findOne(id);
      await this.prisma.brand.delete({ where: { id } });
      return {
        message: 'Brand ochirildi',
        brand,
      };
    } catch (error) {
      throw new NotFoundException('Brand ochirishda xatolik');
    }
  }
}
