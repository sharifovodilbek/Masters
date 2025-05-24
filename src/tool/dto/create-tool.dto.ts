import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateToolDto {
    @ApiProperty()
    @IsString()
    name_uz: string

    @ApiProperty()
    @IsString()
    name_ru: string

    @ApiProperty()
    @IsString()
    name_en: string

    @ApiProperty()
    @IsString()
    description_uz: string

    @ApiProperty()
    @IsString()
    description_ru: string

    @ApiProperty()
    @IsString()
    description_en: string

    @ApiProperty()
    @IsNumber()
    price: number

    @ApiProperty()
    @IsNumber()
    quantity: number

    // @ApiProperty()
    // @IsString()
    // code:string

    // @ApiProperty()
    // isActive: boolean

    @ApiProperty()
    @IsString()
    image: string

    @ApiProperty()
    @IsNumber()
    capacityId:number

    @ApiProperty()
    @IsNumber()
    sizeId:number

    @ApiProperty()
    @IsNumber()
    brandId:number
}
