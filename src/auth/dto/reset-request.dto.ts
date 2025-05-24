import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetRequestDto {
    @ApiProperty({ example: 'alex@gmail.com' })
    @IsString()
    email: string

}