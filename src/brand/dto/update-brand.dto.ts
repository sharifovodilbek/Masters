import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
    @ApiProperty()
    name_uz?: string
    @ApiProperty()
    name_ru?: string
    @ApiProperty()
    name_en?: string
}
