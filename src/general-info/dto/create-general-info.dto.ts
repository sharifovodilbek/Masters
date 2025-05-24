import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateGeneralInfoDto {
    @ApiProperty()
    @IsString()
    email: string

    @ApiProperty()
    @IsString()
    links: string

    @ApiProperty()
    @IsString()
    phones: string


}
