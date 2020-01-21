const fs = require('fs');

import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { PictureDto } from './dtos/pictures/picture.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  uploadPicture(@Body() picture): void {
    const filename = `/Users/Ben/Desktop/${Date.now()}.jpg`;
    console.log(picture);
    fs.writeFile(
      filename,
      picture.base64,
      {
        encoding: 'base64',
      },
      err => {
        if (err) {
          console.log(err);
        }
      },
    );
    return;
  }
}
