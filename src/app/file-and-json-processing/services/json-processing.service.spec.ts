// import { Test, TestingModule } from '@nestjs/testing';
// import { JsonProcessingService } from './json-processing.service';

// describe('JsonProcessingService', () => {
//     let jsonProcessingService: JsonProcessingService

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 JsonProcessingService,
//                 {
//                     provide: getRepositoryToken(Multimedia),
//                     useClass: MultimediaRepositoryMock,
//                 },
//                 {
//                     provide: getRepositoryToken(Files),
//                     useClass: FilesRepositoryMock,
//                 },
//                 {
//                     provide: 'IFileStorageService',
//                     useClass: CloudFileStorageService,
//                 },
//             ],
//         }).compile();