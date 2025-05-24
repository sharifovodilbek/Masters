import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFaqDto } from './create-faq.dto';
import { IsString } from 'class-validator';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
    @ApiProperty()
    @IsString()
    question?: string;

    @ApiProperty()
    @IsString()
    answer?: string;
}
