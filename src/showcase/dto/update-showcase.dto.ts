import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateShowcaseDto } from './create-showcase.dto';
import { IsString } from 'class-validator';

export class UpdateShowcaseDto extends PartialType(CreateShowcaseDto) {
    @ApiProperty()
    name_uz?: string
    @ApiProperty()
    name_ru?: string
    @ApiProperty()
    name_en?: string
    @ApiProperty()
    description_uz?: string
    @ApiProperty()
    description_ru?: string
    @ApiProperty()
    description_en?: string

    @ApiProperty()
    @IsString()
    image?: string

    @ApiProperty()
    @IsString()
    link?: string
}
