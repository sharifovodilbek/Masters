import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) { }

  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }


  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  findAll(
    @Query('filter') filter: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.levelService.findAll(filter, +page, +limit);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(+id);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelService.update(+id, updateLevelDto);
  }

  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.levelService.remove(+id);
  }
}
