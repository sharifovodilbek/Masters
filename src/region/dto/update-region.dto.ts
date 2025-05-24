import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
    @ApiProperty({ example: 'Toshkent' })
    name_uz?: string
    @ApiProperty({ example: 'Ташкент' })
    name_ru?: string
    @ApiProperty({ example: 'Tashkent' })
    name_en?: string
}
