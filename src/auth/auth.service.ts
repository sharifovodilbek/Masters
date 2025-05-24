import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { LoginAuthDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refreshtokenDto';
import { CreateAdminDto } from './dto/add.admin.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailService: MailService,

  ) { }

  async findAll(
    role: Role,
    filter: string,
    page: number,
    limit: number,
  ) {
    let take = limit || 10;
    let skip = page ? (page - 1) * take : 0;
    let where: any = {};
    if (role) {
      where.role = role;
    }
    if (filter) {
      where.name = {
        startsWith: filter,
      };
    }
    let users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        fullname: true,
        phone: true,
        password: true,
        email: true,
        regionId: true,
        role: true,
        verified: true,
        CreatedAt: true,
      }
    });
    return users;
  }


  async register(data: CreateAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Bu email bilan foydalanuvchi mavjud');
    }

    const region = await this.prisma.region.findFirst({
      where: { id: data.regionId },
    });

    if (!region) {
      throw new BadRequestException('Region ID topilmadi');
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    if (data.role === 'USER_FIZ') {
      data.USER_YUR = undefined;
    }


    if (data.role === 'USER_YUR' && !data.USER_YUR) {
      throw new BadRequestException('USER_YUR uchun USER_YUR ma\'lumotlari to\'ldirilishi shart');
    }

    const newUser = await this.prisma.user.create({
      data: {
        fullname: data.fullname,
        phone: data.phone,
        password: hashedPassword,
        email: data.email,
        regionId: data.regionId,
        role: data.role,

        USER_YUR: data.role === 'USER_YUR'
          ? {
            create: {
              INN: data.USER_YUR!.INN,
              R_S: data.USER_YUR!.R_S,
              Address: data.USER_YUR!.Address,
              Bank: data.USER_YUR!.Bank,
              MFO: data.USER_YUR!.MFO,
            },
          }
          : undefined,
      },
      select: {
        id: true,
        fullname: true,
        phone: true,
        email: true,
        password: true,
        regionId: true,
        role: true,
        CreatedAt: true,
        USER_YUR: true,
      },
    });

    return {
      message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi',
      user: newUser,
    };
  }



  async createAdmin(dto: CreateAdminDto) {
    const { phone, email, password, ...rest } = dto;

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone }, { email }],
      },
    });

    const region = await this.prisma.region.findFirst({
      where: { id: dto.regionId },
    });

    if (!region) {
      throw new BadRequestException('Region ID topilmadi');
    }

    if (existing) {
      throw new BadRequestException('Bunday foydalanuvchi allaqachon mavjud');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        phone,
        email,
        password: hashedPassword,
        ...rest,

      },
      select: {
        id: true,
        fullname: true,
        phone: true,
        email: true,
        password: true,
        regionId: true,
        role: true,
        CreatedAt: true,
      }
    });
  }


  async requestReset(data: ResetRequestDto) {
    const { email } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { resetOtp: otp, resetOtpExp: otpExpire, verified: false },
    });

    try {
      await this.mailService.sendEmail(
        email,
        'Parolni tiklash uchun OTP',
        `Sizning OTP kodingiz: ${otp}`
      );

    } catch (e) {
      console.error('Email yuborishda xatolik:', e.message);
      throw new BadRequestException('Email yuborishda xatolik yuz berdi');
    }

    return { message: 'OTP emailingizga yuborildi' };
  }



  async verifyOtp(data: VerifyOtpDto) {
    const { email, otp } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.resetOtp || !user.resetOtpExp)
      throw new BadRequestException('OTP so\'ralmagan');

    if (user.resetOtp !== otp)
      throw new UnauthorizedException('Noto\'g\'ri OTP');

    if (user.resetOtpExp < new Date())
      throw new BadRequestException('OTP eskirgan');

    await this.prisma.user.update({
      where: { email },
      data: { verified: true },
    });

    return { message: 'OTP tasdiqlandi, parolni tiklashingiz mumkin' };
  }


  async resetPassword(data: ResetPasswordDto) {
    const { email, newPassword } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.verified)
      throw new UnauthorizedException('OTP tasdig‘i talab qilinadi');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExp: null,
        verified: true,
      },
    });

    return { message: 'Parol muvaffaqiyatli o‘zgartirildi' };
  }


  async login(data: LoginAuthDto) {
    const { email, password } = data;
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('user not found');

    let match = bcrypt.compareSync(password, user.password);
    if (!match) throw new NotFoundException('wrong password');

    if (!user.verified) {
      throw new UnauthorizedException('Email tasdiqlanmagan. Iltimos, OTP orqali tasdiqlang.');
    }

    let token = this.jwt.sign({ id: user.id, role: user.role, email: user.email });
    return { token };
  }


  async getAccessToken(user: any) {
    return this.jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        role: user.role,
        email: user.email,
        password: user.password,
        phone: user.phone,
      },
      { expiresIn: '1h' },
    );
  }

  async generateRefreshToken(user: any) {
    return this.jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        role: user.role,
        email: user.email,
        password: user.password,
        phone: user.phone,
      },
      { expiresIn: '7d' },
    );
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const user = this.jwt.verify(dto.refreshToken);

      return { accessToken: await this.getAccessToken(user) };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async remove(id: number) {
    let user = await this.prisma.user.findUnique({
      where: { id },
      include: { USER_YUR: true, sessions: true }
    });

    if (!user) throw new NotFoundException('user not found');

    if (user.USER_YUR) {
      await this.prisma.uSER_YUR.delete({
        where: { userId: id },
      });
    }

    if (user.sessions && user.sessions.length > 0) {
      await this.prisma.session.deleteMany({
        where: { userId: id },
      });
    }

    let deleted = await this.prisma.user.delete({ where: { id } });
    return deleted;
  }

}
