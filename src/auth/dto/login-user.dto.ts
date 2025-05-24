import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPhoneNumber, IsString, isString } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({ example: 'alex@gmail.com' })
    @IsString()
    email:string

    @ApiProperty({ example: '12345' })
    @IsString()
    password: string;
}
