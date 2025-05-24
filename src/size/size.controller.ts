import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard,RoleGuard)
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @Get()
  @UseGuards(AuthGuard,RoleGuard)
  findAll(
    @Query('filter') filter: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.sizeService.findAll( filter, +page, +limit);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Get(':id')
  @UseGuards(AuthGuard,RoleGuard)
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(+id);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard,RoleGuard)
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(+id, updateSizeDto);
  }

  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard,RoleGuard)
  remove(@Param('id') id: string) {
    return this.sizeService.remove(+id);
  }
}
