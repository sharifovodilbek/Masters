import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

    class MasterCommentDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNumber()
    star: number;
}

export class updateCommentDto {
    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty()
    @IsNumber()
    star: number;

    @ApiProperty()
    @IsNumber()
    orderId: number;

    @ApiProperty({ type: [MasterCommentDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MasterCommentDto)
    masters: MasterCommentDto[];
}
    
    
