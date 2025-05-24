// import { Start, Update } from 'nestjs-telegraf';
// import { Context } from 'telegraf';
// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Update()
// @Injectable()
// export class TgUpdate {
//     constructor(private prisma: PrismaService) { }
//     @Start()
//     async onStart(ctx: Context) {
//         const chatId = ctx.chat?.id.toString() || '1';
//         const username = ctx.from?.username || undefined;

//         let a = await this.prisma.contact.findFirst({
//             where: { tgUserName: username },
//         });
//         if (!a) {
//             await ctx.reply('You have not ordered yet😞! Have a good rest😊');
//             return;
//         }
//         await this.prisma.contact.update({
//             where: { tgUserName: username },
//             data: { tgChatId: chatId },
//         });
//         console.log(`User @${username} has chatId: ${chatId}`);

//         await ctx.reply(
//             'Salom! Siz bilan bog`lanish uchun , ' + (username ? '@' + username : 'foydalanuvchining nomi') + '!',
//         );
//     }
// }
// telegram-bot.update.ts
import { Update, Start, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PrismaService } from 'src/prisma/prisma.service';

@Update()
export class TgUpdate {
    constructor(private prisma: PrismaService) { }

    @Start()
    async startCommand(@Ctx() ctx: Context) {
        const tgUserName = ctx.from?.username ? '@' + ctx.from.username : null;
        const tgChatId = ctx.chat?.id?.toString();  // numberni stringga aylantirish

        if (!tgChatId) return; // chatId bo'lmasa to'xtash

        const contact = await this.prisma.contact.findFirst({
            where: { tgUserName },
        });

        if (contact) {
            if (!contact.tgChatId) {
                await this.prisma.contact.update({
                    where: { id: contact.id },
                    data: { tgChatId }, // endi string sifatida saqlanadi
                });
                console.log(`✅ ${tgUserName} uchun chatId saqlandi: ${tgChatId}`);
            }
        } else {
            await this.prisma.contact.create({
                data: {
                    tgUserName,
                    tgChatId,
                    fullname: ctx.from?.first_name || '',
                    phone: '+9989999999999',      // yoki boshqa standart qiymat
                    address: 'Tashkent, Uzbekistan',    // majburiy bo‘lsa, to‘ldiring
                    message: 'Salom',

                },
            });
            console.log(`✅ Yangi contact yaratildi: ${tgUserName} chatId bilan ${tgChatId}`);
        }

        return ctx.reply('Salom! Sizning chatId saqlandi.');
    }
}
