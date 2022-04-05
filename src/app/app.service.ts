import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //test1
  getHello(): string {
    return 'Hello World!';
  }
}
