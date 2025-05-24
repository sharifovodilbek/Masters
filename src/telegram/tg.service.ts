


import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
    constructor(
        @InjectBot() private bot: Telegraf<any>,
        private prisma: PrismaService,
    ) { }

    async sendMessageByUsername(text: string, username: string | null) {
        const user = await this.findUserInDB(username);
        if (!user?.chatId) {
            console.log(`❗️ Username: ${username} uchun chatId topilmadi`);
            return 'user not found';
        }
        return this.bot.telegram.sendMessage(user.chatId, text);
    }

    private async findUserInDB(username: string | null) {
        let res = await this.prisma.contact.findFirst({
            where: { tgUserName: username! },
        });
        return {
            username: res?.tgUserName,
            chatId: res?.tgChatId,
        };
    }


    async saveChatIdOnStart(username: string, chatId: string) {
        if (!username) return;

        await this.prisma.contact.updateMany({
            where: { tgUserName: username },
            data: { tgChatId: chatId },
        });

        console.log(`✅ ${username} uchun chatId saqlandi: ${chatId}`);
    }
}
