import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItemDto } from './dto/create-orderItem.dto';
import { TelegramService } from 'src/telegram/tg.service';
import { error } from 'console';
import { log } from 'util';
import { CreateOrderMasterDto } from './dto/create.MasterOrder.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService,
    private telegramService: TelegramService
  ) { }


  async create(data: CreateOrderDto, userId: number) {
    const { adress, date, paymentType, withDelivery, commentToDelivery, orderItems } = data;

    let total = 0;
    const orderItemsData: OrderItemDto[] = [];

    for (const item of orderItems) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      const tool = await this.prisma.tool.findUnique({ where: { id: item.toolId } });

      if (!product || !tool) throw new Error("Usta yoki asbob topilmadi");

      const productCost = product.price_hourly * item.prdQuantity;
      const toolCost = tool.price * item.toolQuantity;
      total += productCost + toolCost;

      if (tool.quantity < item.toolQuantity) {
        throw new Error(`Asbob "${tool.name_uz}" yetarli emas`);
      }

      await this.prisma.tool.update({
        where: { id: tool.id },
        data: { quantity: { decrement: item.toolQuantity } },
      });

      orderItemsData.push({
        productId: item.productId,
        prdQuantity: item.prdQuantity,
        toolId: item.toolId,
        toolQuantity: item.toolQuantity,
      });
    }

    const createdOrder = await this.prisma.order.create({
      data: {
        adress,
        date: new Date(date),
        paymentType,
        withDelivery,
        commentToDelivery,
        total,
        OrderItems: {
          create: orderItemsData,

        },
      },
      include: {
        OrderItems: {
          include: {
            product: true,
            tool: true,
          },
        },
      },
    });

    await this.prisma.basketItem.deleteMany({
      where: { userId },
    });

    const contact = await this.prisma.contact.findUnique({
      where: { id: userId },
    });

    if (contact?.tgUserName) {
      const text = `🛒 Yangi buyurtma yaratildi!
📦 Buyurtma ID: #${createdOrder.id}
💰 Umumiy narx: ${total} so'm
📍 Manzil: ${adress}
📅 Sana: ${date}
🚚 Yetkazib berish: ${withDelivery ? 'Ha' : 'Yo\'q'}
💳 To'lov turi: ${paymentType}
`;


      const orderItemsText = createdOrder.OrderItems.map((item, idx) => {
        const productName = item.product?.name_uz || '';
        const toolName = item.tool?.name_uz || '';

        const productLine = productName ? `🧺 Usta Turi: ${productName}\n🔢 Soni: ${item.prdQuantity}` : '';
        const toolLine = toolName ? `🛠️ Asbob: ${toolName}\n🔧 Soni: ${item.toolQuantity}` : '';

        return `#${idx + 1}\n${productLine}${productLine && toolLine ? '\n' : ''}${toolLine}`;
      }).join('\n\n');

      try {
        await this.telegramService.sendMessageByUsername(`${text}\n\n${orderItemsText}`, contact.tgUserName);
      } catch (err) {
        console.error('Telegramga xabar yuborishda xatolik:', err);
      }
    }

    return createdOrder;
  }


  async assignMasterToOrder(data: CreateOrderMasterDto) {
    const { orderId, masterId } = data;

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order topilmadi');
    }

    const master = await this.prisma.master.findUnique({ where: { id: masterId } });
    if (!master) {
      throw new NotFoundException('Master topilmadi');
    }
    const activeOrder = await this.prisma.orderMasters.findFirst({
      where: {
        masterId,
        status: { not: 'FINISHED' }
      },
      include: {
        order: true
      }
    });


    if (activeOrder) {
      throw new BadRequestException(
        `Bu master hozirda boshqa Orderda biriktirilgan (Order ID: ${activeOrder.order.id})`
      );
    }

    try {
      const orderMaster = await this.prisma.orderMasters.create({
        data: {
          orderId,
          masterId,
        },
        include: {
          master: true,
        },
      });
      return orderMaster;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException('Bu master allaqachon ushbu orderga biriktirilgan');
      }
      throw error;
    }
  }


  async findAll() {
    return this.prisma.order.findMany({
      include: {
        OrderItems: {
          include: { product: true, tool: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        OrderItems: {
          include: { product: true, tool: true },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }


  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const { adress, date, paymentType, withDelivery, commentToDelivery, orderItems } = updateOrderDto;

    const existingOrder = await this.prisma.order.findUnique({ where: { id } });
    if (!existingOrder) throw new NotFoundException('Order not found');

    const parsedDate = date ? new Date(date) : undefined;

    let updatedOrder;

    if (orderItems && orderItems.length > 0) {
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      const newOrderItemsData = orderItems.map(item => ({
        productId: item.productId,
        prdQuantity: item.prdQuantity,
        toolId: item.toolId,
        toolQuantity: item.toolQuantity,
      }));

      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          adress,
          date: parsedDate,
          paymentType,
          withDelivery,
          commentToDelivery,
          OrderItems: {
            create: newOrderItemsData,
          },
        },
        include: {
          OrderItems: {
            include: { product: true, tool: true },
          },
        },
      });
    } else {
      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          adress,
          date: parsedDate,
          paymentType,
          withDelivery,
          commentToDelivery,
        },
        include: {
          OrderItems: {
            include: { product: true, tool: true },
          },
        },
      });
    }

    const contact = await this.prisma.contact.findFirst({
      where: { id: 2 },
    });

    if (contact?.tgUserName) {
      const orderDate = updatedOrder.date?.toISOString().split('T')[0] || 'Noma\'lum';
      const withDeliveryText = updatedOrder.withDelivery ? 'Ha' : 'Yo\'q';
      const comment = updatedOrder.commentToDelivery || 'Yo\'q';

      const orderItemsText = updatedOrder.OrderItems.map((item, idx) => {
        const productName = item.product?.name_uz ? item.product.name_uz : '';
        const toolName = item.tool?.name_uz ? item.tool.name_uz : '';

        const productLine = productName ? `🧺 Usta Turi: ${productName}\n🔢 Soni: ${item.prdQuantity}` : '';
        const toolLine = toolName ? `🛠️ Asbob: ${toolName}\n🔧 Soni: ${item.toolQuantity}` : '';

        return `#${idx + 1}\n${productLine}${productLine && toolLine ? '\n' : ''}${toolLine}`;
      }).join('\n\n');


      const text = `✏️ Buyurtma #${updatedOrder.id} yangilandi!
📍 Manzil: ${updatedOrder.adress}
📅 Sana: ${orderDate}
💳 To'lov turi: ${updatedOrder.paymentType}
🚚 Yetkazib berish: ${withDeliveryText}
📝 Izoh: ${comment}

 🛒 Mahsulotlar:
 ${orderItemsText}`;

      try {
        await this.telegramService.sendMessageByUsername(text, contact.tgUserName);
        console.log(`✅ Buyurtma #${updatedOrder.id} uchun telegram xabar yuborildi.`);
      } catch (err) {
        console.error('❌ Telegramga xabar yuborishda xatolik:', err);
      }
    } else {
      console.log('❗ Telegram chatId topilmadi, xabar yuborilmadi.');
    }

    return updatedOrder;
  }




  async remove(id: number) {

    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    return await this.prisma.order.delete({
      where: { id },
    });
  }

}
