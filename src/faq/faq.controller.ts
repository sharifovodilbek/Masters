import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('FAQ')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
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
    return this.faqService.findAll( filter, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(+id);
  }
  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(+id, updateFaqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(+id);
  }
}
