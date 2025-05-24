import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderItemDto } from './create-orderItem.dto';
import { IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiProperty({ example: 'Tashkent, Chilonzor, 1' })
    @IsString()
    adress?: string;
    @ApiProperty({ example: '2025-05-25T00:00:00Z' })
    date?: string
    @ApiProperty({ example: 'Cash' })
    paymentType?: string
    @ApiProperty()
    withDelivery?: boolean = true
    @ApiProperty({ example: 'Imkon qadar tezroq' })
    @IsString()
    commentToDelivery?: string
    @ApiProperty({ type: [OrderItemDto] })
    orderItems?: OrderItemDto[];
}
