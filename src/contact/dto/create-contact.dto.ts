import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateContactDto {
    @ApiProperty()
    @IsString()
    fullname: string
    @ApiProperty()
    @IsString()
    phone: string
    @ApiProperty()
    @IsString()
    address: string
    @ApiProperty()
    @IsString()
    message: string
    @ApiProperty()
    @IsString()
    tgUserName: string
}
