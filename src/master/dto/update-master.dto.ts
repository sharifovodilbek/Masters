import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMasterDto } from './create-master.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateMasterDto extends PartialType(CreateMasterDto) {
    @ApiProperty()
    @IsString()
    fullname?: string
    @ApiProperty()
    @IsString()
    phone?: string
    @ApiProperty()
    isActive?: boolean
    @ApiProperty({example:1990})
    @IsNumber()
    year?: number
    @ApiProperty()
    @IsString()
    image?: string
    @ApiProperty()
    @IsString()
    passportImage?: string
    @ApiProperty()
    @IsString()
    about?: string
}
