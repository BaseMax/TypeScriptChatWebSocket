import { Test, TestingModule } from '@nestjs/testing';
import { DirectService } from './direct.service';

describe('DirectService', () => {
  let service: DirectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectService],
    }).compile();

    service = module.get<DirectService>(DirectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
