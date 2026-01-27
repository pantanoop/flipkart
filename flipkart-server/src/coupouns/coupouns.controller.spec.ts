import { Test, TestingModule } from '@nestjs/testing';
import { CoupounsController } from './coupouns.controller';
import { CoupounsService } from './coupouns.service';

describe('CoupounsController', () => {
  let controller: CoupounsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoupounsController],
      providers: [CoupounsService],
    }).compile();

    controller = module.get<CoupounsController>(CoupounsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
