import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerDataService } from './crawler-data.service';

describe('CrawlerDataService', () => {
  let service: CrawlerDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlerDataService],
    }).compile();

    service = module.get<CrawlerDataService>(CrawlerDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
