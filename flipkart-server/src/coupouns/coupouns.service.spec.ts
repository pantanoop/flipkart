import { Test, TestingModule } from '@nestjs/testing';
import { CoupounsService } from './coupouns.service';

describe('CoupounsService', () => {
  let service: CoupounsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoupounsService],
    }).compile();

    service = module.get<CoupounsService>(CoupounsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
