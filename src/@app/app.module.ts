import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard } from "@nestjs/throttler";

import { AppRate } from "./app.rate";
import { AppRouter } from "./app.router";
import { AdminModule } from "../admin/admin.module";

@Module({
  imports: [ 
    AppRate,
    AdminModule,
    AppRouter,
    ConfigModule.forRoot({
      envFilePath: (()=>(process.env.npm_lifecycle_event=='start:dev'?'env/dev.env': 'env/prod.env'))(),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
