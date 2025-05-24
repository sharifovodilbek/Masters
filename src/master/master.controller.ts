import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { ApiQuery } from '@nestjs/swagger';
import { MasterStarDto } from './dto/master-star.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) { }

  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard,RoleGuard)
  create(@Body() createMasterDto: CreateMasterDto) {
    return this.masterService.createMaster(createMasterDto);
  }


  @RoleD(Role.ADMIN,Role.SUPER_ADMIN,Role.VIEWER_ADMIN)
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
    return this.masterService.findAll(filter, +page, +limit);
  }


  @RoleD(Role.ADMIN,Role.SUPER_ADMIN,Role.VIEWER_ADMIN)
  @Get(':id')
  @UseGuards(AuthGuard,RoleGuard)
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(+id);
  }


  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard,RoleGuard)
  update(@Param('id') id: string, @Body() updateMasterDto: UpdateMasterDto) {
    return this.masterService.updateMaster(+id, updateMasterDto);
  }


  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard,RoleGuard)
  remove(@Param('id') id: string) {
    return this.masterService.remove(+id);
  }



  @Post('rate')
  @UseGuards(AuthGuard)
  async rateMaster(
    @Req() req: any,
    @Body() MasterStarDto: MasterStarDto
  ) {
    const userId = req.user['id'];
    return this.masterService.rateMaster(userId, MasterStarDto);
  }

}
