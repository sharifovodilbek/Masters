import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard,RoleGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
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
    return this.productService.findAll(filter, +page, +limit);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Get(':id')
  @UseGuards(AuthGuard,RoleGuard)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard,RoleGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard,RoleGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
