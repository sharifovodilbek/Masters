import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { BascketItemService } from './bascket-item.service';
import { CreateBascketItemDto } from './dto/create-bascket-item.dto';
import { UpdateBascketItemDto } from './dto/update-bascket-item.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';

@Controller('bascket-item')
export class BascketItemController {
  constructor(private readonly bascketItemService: BascketItemService) { }
  
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: CreateBascketItemDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.bascketItemService.create(data, userId);
  }


  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @Get()
  findAll(
    @Query('filter') filter: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.bascketItemService.findAll(filter, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bascketItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBascketItemDto: UpdateBascketItemDto) {
    return this.bascketItemService.update(+id, updateBascketItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bascketItemService.remove(+id);
  }
}
