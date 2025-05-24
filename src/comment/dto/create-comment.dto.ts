import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class MasterCommentDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  star: number;
}

export class CreateCommentDto {
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
