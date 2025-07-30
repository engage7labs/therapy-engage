import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver, HealthController } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      csrfPrevention: false,
      introspection: true,
      playground: true,
    }),
  ],
  controllers: [HealthController],
  providers: [AppResolver],
})
export class AppModule {}