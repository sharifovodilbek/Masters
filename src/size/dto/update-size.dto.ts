import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSizeDto } from './create-size.dto';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
    @ApiProperty()
    name_uz?: string
    @ApiProperty()
    name_ru?: string
    @ApiProperty()
    name_en?: string

}
