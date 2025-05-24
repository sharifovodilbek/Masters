import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService
  ) { }

  async create(data: CreateContactDto) {
    try {
      return await this.prisma.contact.create({
        data
      });
    } catch (error) {
      console.log(error);

      throw new NotFoundException('Contact yaratishda xatolik yuz berdi');
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
        where.fullname = {
          startsWith: filter,
        };
      }

      const contacts = await this.prisma.contact.findMany({
        where,
        skip,
        take,
      });

      return contacts;
    } catch (error) {
      throw new NotFoundException(`Contactni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const contact = await this.prisma.contact.findUnique({ where: { id } });
      if (!contact) {
        throw new NotFoundException('Contact topilmadi');
      }
      return contact;
    } catch (error) {
      throw new NotFoundException('Contact olishda xatolik');
    }
  }

  async update(id: number, data: UpdateContactDto) {
    try {
      await this.findOne(id);
      return await this.prisma.contact.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new NotFoundException('Contact yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x = await this.findOne(id);
      await this.prisma.contact.delete({ where: { id } });
      return {
        message: 'Contact o\'chirildi',
        data: x
      }
    } catch (error) {
      throw new NotFoundException('Contact ochirishda xatolik');
    }
  }
}
