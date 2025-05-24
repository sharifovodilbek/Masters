import { ApiProperty } from "@nestjs/swagger"

export class CreateRegionDto {
    @ApiProperty({example:'Toshkent'})
    name_uz:string
    @ApiProperty({example:'Ташкент'})
    name_ru:string
    @ApiProperty({example:'Tashkent'})
    name_en:string
}
