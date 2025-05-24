import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBascketItemDto {
//   @ApiProperty()
//   @IsNumber()
//   @Type(() => Number)
//   userId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prdQuantity?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  toolId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  toolQuantity?: number;
}
