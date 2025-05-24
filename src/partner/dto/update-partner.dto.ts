import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsString } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
    @ApiProperty()
    @IsString()
    name_uz?: string

    @ApiProperty()
    @IsString()
    name_ru?: string

    @ApiProperty()
    @IsString()
    name_en?: string

    @ApiProperty()
    @IsString()
    image?: string
}
