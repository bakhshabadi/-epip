import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "../@database/database.module";
import { CustomerController } from "./controllers/customer/customer.controller";
import { EventController } from "./controllers/event/event.controller";
import { PersonController } from "./controllers/person/person.controller";
import { PostController } from "./controllers/post/post.controller";
import { AdminTasksService } from "./crons/admin.cron";
import { AvanakService } from "./services/avanak.service";
import { CustomerProviders, CustomerService } from "./services/customer.service";
import { EventProviders, EventService } from "./services/event.service";
import { KavenegarService } from "./services/kavenegar.service";
import { PersonProviders, PersonService } from "./services/person.service";
import { PostProviders, PostService } from "./services/post.service";

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    CustomerController, 
    PersonController, 
    EventController,
    PostController
  ],
  providers: [
    KavenegarService,
    AvanakService,

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
export class AdminModule { }
