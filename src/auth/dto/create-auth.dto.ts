// create-auth.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UserYurDto {
  @ApiProperty()
  @IsString()
  INN: string;

  @ApiProperty()
  @IsString()
  MFO: string;

  @ApiProperty()
  @IsString()
  Oked: string;

  @ApiProperty()
  @IsString()
  Bank: string;

  @ApiProperty()
  @IsString()
  Address: string;

  @ApiProperty()
  @IsString()
  R_S: string;
}

export class CreateAuthDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  fullname: string;

  @ApiProperty({ example: "+998912345678" })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: "12345" })
  @IsString()
  password: string;

  @ApiProperty({ example: "alex@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  regionId: number;

  @ApiProperty({ example: "USER_FIZ", enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ type: () => UserYurDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserYurDto)
  USER_YUR?: UserYurDto;
}
