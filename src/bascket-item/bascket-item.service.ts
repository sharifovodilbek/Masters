import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBascketItemDto } from './dto/create-bascket-item.dto';
import { UpdateBascketItemDto } from './dto/update-bascket-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BascketItemService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateBascketItemDto, userId: number) {
    try {
      const { productId, toolId, prdQuantity, toolQuantity } = data;

      return await this.prisma.basketItem.create({
        data: {
          userId,
          productId: productId ?? undefined,
          toolId: toolId ?? undefined,
          prdQuantity: prdQuantity ?? undefined,
          toolQuantity: toolQuantity ?? undefined,
        },
      });
    } catch (error) {
      console.log(error);
      
      throw new NotFoundException('BascketItem yaratishda xatolik yuz berdi');
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

      const items = await this.prisma.basketItem.findMany({
        where: {
          OR: [
            {
              product: {
                name_uz: {
                  contains: filter,
                  mode: 'insensitive',
                },
              },
            },
            {
              tool: {
                name_uz: {
                  contains: filter,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        include: {
          product: true,
          tool: true,
        },
        skip,
        take,
      });

      return items;
    } catch (error) {
      throw new NotFoundException(`bascketItemni olishda xatolik`);
    }
  }



  async findOne(id: number) {
    try {
      const basketItem = await this.prisma.basketItem.findUnique({ where: { id } });
      if (!basketItem) {
        throw new NotFoundException('BascketItem topilmadi');
      }
      return basketItem;
    } catch (error) {
      throw new NotFoundException('BascketItem olishda xatolik');
    }
  }

  async update(id: number, data: UpdateBascketItemDto) {
    try {
      await this.findOne(id);
      return await this.prisma.basketItem.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new NotFoundException('BascketItem yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const item = await this.findOne(id);
      await this.prisma.basketItem.delete({ where: { id } });
      return {
        message: 'Deleted successfully',
        deletedItem: item,
      };
    } catch (error) {
      throw new NotFoundException('BasketItem o\'chirishda xatolik yuz berdi');
    }
  }

}

