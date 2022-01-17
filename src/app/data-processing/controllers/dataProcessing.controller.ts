import { Controller, Get, Inject, Post, UploadedFile, UseInterceptors, Response } from '@nestjs/common';
import { IDataProcessingService } from '../services/data-processing.service.interface';
import { Response as eResponse } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('data-processing')
export class DataProcessingController {
  constructor(@Inject('IDataProcessingService') private dataProcessingService: IDataProcessingService) {}

  @Get('test')
  getHello(): string {
    console.log('HIIIIIIIIIIIIIII');
    return this.dataProcessingService.processData();
  }
  @Post('getFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileXlsxp(@UploadedFile() file: any, @Response() res: eResponse): Promise<void> {
    console.log(file);
    const result = await this.dataProcessingService.uploadFileXlsxType(file);
    res.status(201).json(result);
  }
}
