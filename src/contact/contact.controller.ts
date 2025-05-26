import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
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
    return this.contactService.findAll( filter, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @RoleD(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
