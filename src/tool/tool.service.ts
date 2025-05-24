import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createToolDto: CreateToolDto) {
    let newTool;
    try{
      const code = await this.generateUniqueCode();

      newTool = await this.prisma.tool.create({
        data: {
          ...createToolDto,
          code,
        },
      });
    }catch(e){
      throw new NotFoundException("Tool yaratishda xatolik yuz berdi")
    }

    return newTool;
  }

  private async generateUniqueCode(): Promise<string> {
    let code: string;
    let exists = true;

    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await this.prisma.tool.findFirst({
        where: { code },
      });
      exists = !!existing;
    } while (exists);

    return code;
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

      const tools = await this.prisma.tool.findMany({
        where,
        skip,
        take,
        include:{
          orders: true,
        }
      });

      return tools;
    } catch (error) {
      throw new NotFoundException(`Toolni olishda xatolik`);
    }
  }

  async findOne(id: number) {
    try {
      const tool = await this.prisma.tool.findUnique({ where: { id } });
      if (!tool) {
        throw new NotFoundException('Tool topilmadi');
      }
      return tool;
    } catch (error) {
      throw new NotFoundException('Tool olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateToolDto) {
    try {
      await this.findOne(id);
      return await this.prisma.tool.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Tool yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const x=await this.findOne(id);
      await this.prisma.tool.delete({ where: { id } });
      return {
        message: 'Tool o\'chirildi',
        data: x,
      }
    } catch (error) {
      throw new NotFoundException('Tool ochirishda xatolik');
    }
  }
}
