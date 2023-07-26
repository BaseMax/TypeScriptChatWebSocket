import { Module } from '@nestjs/common';
import { DirectService } from './direct.service';

@Module({
  providers: [DirectService],
  exports: [DirectService],
})
export class DirectModule {}
