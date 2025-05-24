import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class OrderItemDto {
    // @ApiProperty()
    // @IsNumber()
    // orderId: number;
    @ApiProperty()
    @IsNumber()
    productId: number;
    @ApiProperty()
    @IsNumber()
    prdQuantity: number;
    @ApiProperty()
    @IsNumber()
    toolId: number;
    @ApiProperty()
    @IsNumber()
    toolQuantity: number;
}
