import { Query, Resolver } from '@nestjs/graphql';

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