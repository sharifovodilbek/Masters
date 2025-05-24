import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ example: 'alex@gmail.com' })
    @IsString()
    email: string
    @ApiProperty({ example: '123456' })
    newPassword: string;
}