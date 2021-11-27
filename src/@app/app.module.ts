import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard } from "@nestjs/throttler";

import { AppRate } from "./app.rate";
import { AppRouter } from "./app.router";
import { AdminModule } from "../admin/admin.module";
import { ScheduleModule } from "@nestjs/schedule";
import { AdminTasksService } from "src/admin/crons/admin.cron";
import { CustomerProviders, CustomerService } from "src/admin/services/customer.service";
import { DatabaseModule } from "src/@database/database.module";
import { KavenegarService } from "src/admin/services/kavenegar.service";
import { AvanakService } from "src/admin/services/avanak.service";
import { EventProviders, EventService } from "src/admin/services/event.service";
import { PersonProviders, PersonService } from "src/admin/services/person.service";

@Module({
  imports: [ 
    DatabaseModule,
    
    AppRate,
    AdminModule,
    AppRouter,
    ConfigModule.forRoot({
      envFilePath: (()=>(process.env.npm_lifecycle_event=='start'?'env/dev.env': 'env/prod.env'))(),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    AdminTasksService,
    CustomerService,
    PersonService,
    EventService,
    KavenegarService,
    AvanakService,
    ...CustomerProviders,
    ...PersonProviders,
    ...EventProviders,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
