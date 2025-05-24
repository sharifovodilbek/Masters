import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateCommentDto & { userId: number }) {
    try {
      const { masters, message, star, userId, orderId } = data;

      return await this.prisma.comment.create({
        data: {
          message,
          star,
          userId,
          orderId,
          CommentMasters: {
            create: masters.map(master => ({
              masterId: master.id,
              star: master.star,
            })),
          },
        },
        include: {
          CommentMasters: true,
        },
      });
    } catch (error) {
      console.log(error);

      throw new NotFoundException('Comment yaratishda xatolik yuz berdi');
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
        where.message = {
          startsWith: filter,
        };
      }

      const comments = await this.prisma.comment.findMany({
        where,
        skip,
        take,
      });

      return comments;
    } catch (error) {
      throw new NotFoundException(`Commentni olishda xatolik`);
    }
  }


  async findOne(id: number) {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new NotFoundException('Comment topilmadi');
      }
      return comment;
    } catch (error) {
      throw new NotFoundException('Comment olishda xatolik');
    }
  }


  async update(id: number, data: updateCommentDto & { userId: number }) {
    try {
      const { masters, message, star, userId, orderId } = data;

      await this.prisma.commentMasters.deleteMany({
        where: { commentId: id },
      });

      return await this.prisma.comment.update({
        where: { id },
        data: {
          message,
          star,
          userId,
          orderId,
          CommentMasters: {
            create: masters.map(master => ({
              masterId: master.id,
              star: master.star,
            })),
          },
        },
        include: {
          CommentMasters: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Comment yangilashda xatolik');
    }
  }



  async remove(id: number) {
    try {
      await this.prisma.commentMasters.deleteMany({
        where: { commentId: id },
      });

      await this.prisma.comment.delete({ where: { id } });
      return {
        message: 'Comment o\'chirildi',
      }
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Comment ochirishda xatolik');
    }
  }

}
