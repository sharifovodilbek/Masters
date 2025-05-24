import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGeneralInfoDto } from './create-general-info.dto';
import { IsString } from 'class-validator';

export class UpdateGeneralInfoDto extends PartialType(CreateGeneralInfoDto) {
    @ApiProperty()
    @IsString()
    email?: string

    @ApiProperty()
    @IsString()
    links?: string

    @ApiProperty()
    @IsString()
    phones?: string

}
