import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { Role, UserType } from '@prisma/client';
import { IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @ApiProperty({ example: "John Doe" })
    @IsString()
    fullname?: string;

    @ApiProperty({ example: "+998912345678" })
    @IsPhoneNumber()
    phone?: string;

    @ApiProperty({ example: '12345' })
    @IsString()
    password?: string;

    @ApiProperty({ example: 'alex@gmail.com' })
    @IsString()
    email?:string

    @ApiProperty({ example: 1 })
    @IsNumber()
    regionId?: number;

    @ApiProperty({ example: 'ADMIN' })
    role?: Role

    @ApiProperty({ example: 'JISMONIY_SHAXS' })
    UserType?: UserType
}
