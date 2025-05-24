import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
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

      const products = await this.prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          level: true,
          orders: true,
          tools: true,

        }
      });

      return products;
    } catch (error) {
      throw new NotFoundException(`Productni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        level: true,
        tools: true,
      },
    });
    if (!product) throw new NotFoundException('Product topilmadi');
    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);

      await this.prisma.orderItem.deleteMany({
        where: { productId: id },
      });

      await this.prisma.product.delete({
        where: { id },
      });
      return {
        message: 'Product o\'chirildi',
        data: x
      }
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Product ochirishda xatolik yuz berdi');
    }
  }

}
