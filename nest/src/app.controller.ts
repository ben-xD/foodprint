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
  uploadPicture(@Body() image): string {
    // store received image on Filesystem
    console.log(image);
    return 'Good bye';
  }
}
