import { HttpModule } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { DataAggregationController } from './controllers/data-aggregation.controller';
import { DataAggregationService } from './services/data-aggregation.service';

@Module({
    imports: [HttpModule],
    providers: [
        {
            provide: 'IDataAggregationService',
            useClass: DataAggregationService,
        },
    ],
    controllers: [DataAggregationController],
    exports: ['IDataAggregationService'],
})
export class DataAggregationModule { }