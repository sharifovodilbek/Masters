import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneralInfoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateGeneralInfoDto) {
    try {
      return await this.prisma.generalInfo.create({
        data
      });
    } catch (error) {
      throw new NotFoundException('generalInfo yaratishda xatolik yuz berdi');
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
        where.email = {
          startsWith: filter,
        };
      }

      const info = await this.prisma.generalInfo.findMany({
        where,
        skip,
        take,
      });

      return info;
    } catch (error) {
      throw new NotFoundException(`generalInfoni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const generalInfo = await this.prisma.generalInfo.findUnique({ where: { id } });
      if (!generalInfo) {
        throw new NotFoundException('generalInfo topilmadi');
      }
      return generalInfo;
    } catch (error) {
      throw new NotFoundException('generalInfo olishda xatolik');
    }
  }

  async update(id: number, data: UpdateGeneralInfoDto) {
    try {
      await this.findOne(id);
      return await this.prisma.generalInfo.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new NotFoundException('generalInfo yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);
      await this.prisma.generalInfo.delete({ where: { id } });
      return {
        message: 'generalInfo o\'chirildi',
        data: x
      }
    } catch (error) {
      throw new NotFoundException('generalInfo ochirishda xatolik');
    }
  }
}
