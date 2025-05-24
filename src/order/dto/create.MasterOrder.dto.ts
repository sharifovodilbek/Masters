import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsInt } from 'class-validator';

export class CreateOrderMasterDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    orderId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    masterId: number;
    // @ApiProperty({ example: 'PENDING' })
    status: OrderStatus;
}
