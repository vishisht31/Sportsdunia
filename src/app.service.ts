import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This Assignment is Submitted By Vishisht Maroria!';
  }
}
