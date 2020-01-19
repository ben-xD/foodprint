import { Injectable } from '@nestjs/common';

import * as meals from '../meals.json';
@Injectable()
export class AppService {
  getHello(): string {
    return JSON.stringify(meals);
  }
}
