import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //dummy method
  getHello(): string {
    return 'Hello World!';
  }
}
