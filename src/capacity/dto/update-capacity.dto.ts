import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCapacityDto } from './create-capacity.dto';

export class UpdateCapacityDto extends PartialType(CreateCapacityDto) {
     @ApiProperty()
    name_uz?: string
    @ApiProperty()
    name_ru?: string
    @ApiProperty()
    name_en?: string
}
