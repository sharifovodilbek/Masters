import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RoleD } from 'src/auth/decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) { }


  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard,RoleGuard)
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN,Role.VIEWER_ADMIN,Role.USER_YUR,Role.USER_FIZ)
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
    return this.toolService.findAll(filter, +page, +limit);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN,Role.VIEWER_ADMIN,Role.USER_YUR,Role.USER_FIZ)
  @Get(':id')
  @UseGuards(AuthGuard,RoleGuard)
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(+id);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard,RoleGuard)
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(+id, updateToolDto);
  }

  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard,RoleGuard)
  remove(@Param('id') id: string) {
    return this.toolService.remove(+id);
  }
}
