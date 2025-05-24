import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './session/session.module';
import { RegionModule } from './region/region.module';
import { AuthModule } from './auth/auth.module';
import { SizeModule } from './size/size.module';
import { BrandModule } from './brand/brand.module';
import { CapacityModule } from './capacity/capacity.module';
import { LevelModule } from './level/level.module';
import { ToolModule } from './tool/tool.module';
import { PartnerModule } from './partner/partner.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { GeneralInfoModule } from './general-info/general-info.module';
import { FaqModule } from './faq/faq.module';
import { ContactModule } from './contact/contact.module';
import { CommentModule } from './comment/comment.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { MasterModule } from './master/master.module';
import { BascketItemModule } from './bascket-item/bascket-item.module';
import { OrderModule } from './order/order.module';
import { TgModule } from './telegram/tg.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/',
    }), PrismaModule, RegionModule, AuthModule, SizeModule, BrandModule, CapacityModule, LevelModule, ToolModule, PartnerModule, ShowcaseModule, GeneralInfoModule, FaqModule, ContactModule, ProductModule, MasterModule, BascketItemModule, OrderModule, CommentModule,TgModule, SessionModule, UploadModule ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule { }
