import { Global, Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TgUpdate } from './tg.update';
import { TelegramService } from './tg.service';

@Global()
@Module({
    imports: [
        TelegrafModule.forRoot({
            token: '7543039045:AAEL1hjt5_wL9KExT7Rn8uB4KOd9X0yr7uk',
        }),
    ],
    providers: [TgUpdate, TelegramService],
    exports: [TelegramService],
})
export class TgModule { }
