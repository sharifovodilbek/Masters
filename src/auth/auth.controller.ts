import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Role } from '@prisma/client';
import { ApiQuery } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { LoginAuthDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refreshtokenDto';
import { CreateAdminDto } from './dto/add.admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @Get()
  findAll(
    @Query('role') role: Role,
    @Query('filter') filter: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.authService.findAll(role, filter, +page, +limit);
  }

  @Post('register')
  async register(@Body() data: CreateAuthDto) {
    return await this.authService.register(data);
  }

  @Post('Add-Admin')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }

  @Post('request-reset')
  async requestReset(@Body() data: ResetRequestDto) {
    return this.authService.requestReset(data);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Post('login')
  async login(@Body() data: LoginAuthDto) {
    return await this.authService.login(data);
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return await this.authService.refreshToken(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

}