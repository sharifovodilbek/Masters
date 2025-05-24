import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator"

export class ProductDto {
    @ApiProperty({example:1})
    @IsNumber()
    productId: number

    @ApiProperty({example:5})
    @IsNumber()
    minWorkingHours: number

    @ApiProperty({example:1})
    @IsNumber()
    levelId: number

    @ApiProperty({example:22000})
    @IsNumber()
    priceHourly: number

    @ApiProperty({example:250000})
    @IsNumber()
    priceDaily: number

    @ApiProperty({example:5})
    @IsNumber()
    experience: number

    // @ApiProperty()
    // @IsString()
    // tools: string
}


export class CreateMasterDto {
    @ApiProperty()
    @IsString()
    fullname: string
    @ApiProperty()
    @IsString()
    phone: string
    @ApiProperty()
    isActive: boolean
    @ApiProperty({example:1990})
    @IsNumber()
    year: number
    @ApiProperty()
    @IsString()
    image: string
    @ApiProperty()
    @IsString()
    passportImage: string

    @ApiProperty()
    @IsString()
    about: string

    @ApiProperty({ type: [ProductDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products?: ProductDto[]

}
