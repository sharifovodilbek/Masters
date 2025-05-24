import { ApiProperty } from "@nestjs/swagger";
import { Role, UserType } from "@prisma/client";
import { IsNumber, IsPhoneNumber, IsString, isString } from "class-validator";

export class CreateAdminDto {
    @ApiProperty({ example: "John Doe" })
    @IsString()
    fullname: string;

    @ApiProperty({ example: "+998912345678" })
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ example: '12345' })
    @IsString()
    password: string;

    @ApiProperty({ example: 'alex@gmail.com' })
    @IsString()
    email: string

    @ApiProperty({ example: '1' })
    @IsNumber()
    regionId: number;

    @ApiProperty({ example: 'ADMIN' })
    role: Role

   
}
