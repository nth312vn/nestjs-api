import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.disk.checkStorage('disk', { thresholdPercent: 0.9, path: '/' }),
      async () =>
        this.memory.checkHeap('memory_heap', 300 * 1024 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024 * 1024),
    ]);
  }
}
