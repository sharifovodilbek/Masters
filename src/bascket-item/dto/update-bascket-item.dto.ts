import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBascketItemDto } from './create-bascket-item.dto';
import { IsNumber } from 'class-validator';

export class UpdateBascketItemDto extends PartialType(CreateBascketItemDto) {
    @ApiProperty()
    @IsNumber()
    productId?: number;

    @ApiProperty()
    @IsNumber()
    prdQuantity?: number;

    @ApiProperty()
    @IsNumber()
    toolId?: number;

    @ApiProperty()
    @IsNumber()
    toolQuantity?: number;
}
