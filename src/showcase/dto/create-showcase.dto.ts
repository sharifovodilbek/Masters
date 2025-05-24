import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateShowcaseDto {
    @ApiProperty()
    name_uz: string
    @ApiProperty()
    name_ru: string
    @ApiProperty()
    name_en: string
    @ApiProperty()
    description_uz: string
    @ApiProperty()
    description_ru: string
    @ApiProperty()
    description_en: string

    @ApiProperty()
    @IsString()
    image: string

    @ApiProperty()
    @IsString()
    link: string
}
