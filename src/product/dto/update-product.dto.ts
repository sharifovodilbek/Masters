import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty()
    @IsString()
    name_uz?: string
    @ApiProperty()
    @IsString()
    name_ru?: string
    @ApiProperty()
    @IsString()
    name_en?: string
    @ApiProperty()
    @IsString()
    image?: string
    @ApiProperty()
    isActive?: boolean
    @ApiProperty()
    @IsNumber()
    minWorkingHours?: number
    @ApiProperty()
    @IsNumber()
    levelId?: number
    @ApiProperty()
    @IsNumber()
    price_hourly?: number
    @ApiProperty()
    @IsNumber()
    price_daily?: number
}
