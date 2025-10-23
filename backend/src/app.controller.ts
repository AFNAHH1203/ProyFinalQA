import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): object {
    return this.appService.getHealth();
  }

  @Get('api/status')
  getApiStatus(): object {
    return this.appService.getApiStatus();
  }
}