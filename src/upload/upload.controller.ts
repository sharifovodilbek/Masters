import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
  
  @Controller('upload')
  @ApiTags('Upload')
  export class UploadController {
    @Post('image')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            cb(null, filename);
          },
        }),
      }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      const baseUrl = 'http://localhost:3000';
      return {
        message: 'Fayl yuklandi!',
        link: `${baseUrl}/${file.filename}`,
      };
    }
  }
  