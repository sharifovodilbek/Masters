import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MasterStarDto } from './dto/master-star.dto';

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) { }

  async createMaster(dto: CreateMasterDto) {
    const existingMaster = await this.prisma.master.findFirst({
      where: { phone: dto.phone },
    });
    if (existingMaster) {
      throw new BadRequestException('Telefon raqam foydalanilgan');
    }

    if (dto.products?.length) {
      for (const item of dto.products) {
        const productExists = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!productExists) {
          throw new NotFoundException(`Product topilmadi: ${item.productId}`);
        }

        const levelExists = await this.prisma.level.findUnique({
          where: { id: item.levelId },
        });
        if (!levelExists) {
          throw new NotFoundException(`Level topilmadi: ${item.levelId}`);
        }
      }
    }

    const master = await this.prisma.master.create({
      data: {
        fullname: dto.fullname,
        year: dto.year,
        about: dto.about,
        isActive: dto.isActive ?? true,
        image: dto.image,
        passportImage: dto.passportImage,
        phone: dto.phone,


      },
    });

    if (dto.products?.length) {
      await this.prisma.masterProduct.createMany({
        data: dto.products.map((item) => ({
          masterId: master.id,
          productId: item.productId,
          levelId: item.levelId,
          minWorkingHours: item.minWorkingHours,
          price_hourly: item.priceHourly,
          price_daily: item.priceDaily,
          experience: Number(item.experience),

        })),
      });
    }

    const result = await this.prisma.master.findUnique({
      where: { id: master.id },
      include: { MasterProducts: true },
    });

    return { data: result };
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
        where.fullname = {
          startsWith: filter,
        };
      }

      const masters = await this.prisma.master.findMany({
        where,
        skip,
        take,
      });

      return masters;
    } catch (error) {
      throw new NotFoundException(`Masterni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    const master = await this.prisma.master.findUnique({
      where: { id },
    });

    if (!master) {
      throw new NotFoundException('Master topilmadi');
    }

    const avgStar = await this.prisma.star.aggregate({
      where: { masterId: id },
      _avg: { star: true },
    });

    return {
      ...master,
      avgStar: avgStar._avg.star ?? 0,
    };
  }


  async updateMaster(id: number, dto: UpdateMasterDto) {
    await this.findOne(id);

    const { products, ...masterData } = dto;

    await this.prisma.master.update({
      where: { id },
      data: masterData,
    });

    if (products?.length) {
      await this.prisma.masterProduct.deleteMany({
        where: { masterId: id },
      });

      await this.prisma.masterProduct.createMany({
        data: products.map((item) => ({
          masterId: id,
          productId: item.productId,
          levelId: item.levelId,
          minWorkingHours: item.minWorkingHours,
          price_hourly: item.priceHourly,
          price_daily: item.priceDaily,
          experience: Number(item.experience),
        })),
      });
    }

    return this.findOne(id);
  }




  async remove(id: number) {

    await this.prisma.orderMasters.deleteMany({
      where: { masterId: id },
    });

    await this.prisma.star.deleteMany({
      where: { masterId: id },
    });

    await this.prisma.masterProduct.deleteMany({
      where: { masterId: id },
    });

    return await this.prisma.master.delete({
      where: { id },
    });
  }



  async rateMaster(userId: number, data: MasterStarDto) {
    const { masterId, star } = data;

    const existing = await this.prisma.star.findFirst({
      where: {
        userId,
        masterId,
      },
    });

    if (existing) {
      return this.prisma.star.update({
        where: { id: existing.id },
        data: { star },
      });
    }

    return this.prisma.star.create({
      data: {
        userId,
        masterId,
        star,
      },
    });
  }
}

