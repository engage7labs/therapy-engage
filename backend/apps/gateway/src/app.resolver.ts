import { Query, Resolver } from '@nestjs/graphql';
import { Controller, Get } from '@nestjs/common';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello from Therapy Engage Platform!';
  }

  @Query(() => String)
  health(): string {
    return 'API is running successfully';
  }
}

@Controller()
export class HealthController {
  @Get('/health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}