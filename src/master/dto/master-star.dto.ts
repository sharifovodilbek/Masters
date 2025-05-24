import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class MasterStarDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  masterId: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  star: number;
}
