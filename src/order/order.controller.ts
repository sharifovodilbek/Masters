import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateOrderMasterDto } from './dto/create.MasterOrder.dto';
import { OrderMasters, Role } from '@prisma/client';
import { RoleD } from 'src/auth/decorator';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService,
    private readonly orderMastersService: OrderService
  ) { }

  @RoleD(Role.USER_FIZ,Role.USER_YUR,Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard,RoleGuard)
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user['id'];
    return this.orderService.create(dto, userId);
  }

  @RoleD(Role.ADMIN)
  @Post('OrderMaster')
  @UseGuards(AuthGuard,RoleGuard)
  async assignMaster(@Body() dto: CreateOrderMasterDto) {
    return await this.orderMastersService.assignMasterToOrder(dto);
  }


  @RoleD(Role.ADMIN,Role.VIEWER_ADMIN,Role.SUPER_ADMIN)
  @Get()
  @UseGuards(AuthGuard,RoleGuard)
  findAll() {
    return this.orderService.findAll();
  }

  @RoleD(Role.ADMIN,Role.VIEWER_ADMIN,Role.SUPER_ADMIN)
  @Get(':id')
  @UseGuards(AuthGuard,RoleGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @RoleD(Role.ADMIN,Role.SUPER_ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard,RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard,RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
