import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { IsString } from 'class-validator';

export class UpdateContactDto extends PartialType(CreateContactDto) {
    @ApiProperty()
    @IsString()
    fullname?: string
    @ApiProperty()
    @IsString()
    phone?: string
    @ApiProperty()
    @IsString()
    address?: string
    @ApiProperty()
    @IsString()
    message?: string
    @ApiProperty()
    @IsString()
    tgUserName?: string
}
