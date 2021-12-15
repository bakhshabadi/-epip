import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "../@database/database.module";
import { BaladController } from "./controllers/balad/balad.controller";
import { CustomerController } from "./controllers/customer/customer.controller";
import { DivarController } from "./controllers/divar/divar.controller";
import { EventController } from "./controllers/event/event.controller";
import { PersonController } from "./controllers/person/person.controller";
import { PostController } from "./controllers/post/post.controller";
import { AdminTasksService } from "./crons/admin.cron";
import { AdminMiddleware } from "./middlewares/global.middleware";
import { AvanakService } from "./services/avanak.service";
import { BaladService } from "./services/balad.service";
import { CustomerProviders, CustomerService } from "./services/customer.service";
import { DivarService } from "./services/divar.service";
import { EventProviders, EventService } from "./services/event.service";
import { KavenegarService } from "./services/kavenegar.service";
import { PersonProviders, PersonService } from "./services/person.service";
import { PostProviders, PostService } from "./services/post.service";

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    BaladController,
    CustomerController, 
    PersonController, 
    EventController,
    PostController,

    DivarController,
  ],
  providers: [
    KavenegarService,
    AvanakService,
    BaladService,
    DivarService,

    CustomerService, 
    PersonService,
    EventService,
    PostService,  

    ...CustomerProviders, 
    ...PersonProviders,
    ...EventProviders,
    ...PostProviders
  ],
})
export class AdminModule  implements NestModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('*');
  }
}
