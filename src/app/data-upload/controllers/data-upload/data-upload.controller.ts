import { Controller, Inject, Param, Post, UploadedFile, UseInterceptors, Response, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response as eResponse } from 'express';
import { IDataProcessingService } from '../../../data-processing/services/data-processing.service.interface';

@Controller('data-upload')
export class DataUploadController {
  constructor(@Inject('IDataProcessingService') private dataProcessingService: IDataProcessingService) {}

  @Post('uploadFile/:type/:teamId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileXlsx(
    @UploadedFile() file: any,
    @Param('teamId') teamId: string,
    @Param('type') type: string,
    @Response() res: eResponse,
  ): Promise<void> {
    console.log(
      'finally reached from backend to aggregation service=====================================================',
    );
    console.log(file);
    const result = await this.dataProcessingService.processXLSXfile(file, teamId, type);
    res.status(201).json(result);
  }

  @Post('uploadJSONFile/:type/:teamId')
  async uploadFileXlsxAsJSON(
    @Body() file: any,
    @Param('teamId') teamId: string,
    @Param('type') type: string,
    @Response() res: eResponse,
  ): Promise<void> {
    console.log(
      'finally reached from backend to aggregation service=====================================================',
    );
    console.log(file);
    const result = await this.dataProcessingService.processXLSXfile(file, teamId, type);
    res.status(201).json(result);
  }
}
