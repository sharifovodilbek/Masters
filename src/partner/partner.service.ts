import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePartnerDto) {
    try {
      return await this.prisma.partner.create({
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Partner yaratishda xatolik yuz berdi');
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

      const partners = await this.prisma.partner.findMany({
        where,
        skip,
        take,
      });

      return partners;
    } catch (error) {
      throw new NotFoundException(`Partnerni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const partner = await this.prisma.partner.findUnique({ where: { id } });
      if (!partner) {
        throw new NotFoundException('Partner topilmadi');
      }
      return partner;
    } catch (error) {
      throw new NotFoundException('Partner olishda xatolik');
    }
  }

  async update(id: number, dto: UpdatePartnerDto) {
    try {
      await this.findOne(id);
      return await this.prisma.partner.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Partner yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);
      await this.prisma.partner.delete({ where: { id } });
      return {
        message: 'Partner o\'chirildi',
        data: x
      };
    } catch (error) {
      throw new NotFoundException('Partner ochirishda xatolik');
    }
  }
}
