import { Module } from "@nestjs/common";
// import { BaseController } from "src/@core/controllers/base.controller";
import { DatabaseModule } from "src/@database/database.module";
import { UserController } from "./controllers/user.controller";
import { UserProviders, UserService } from "./services/user.service";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService,...UserProviders],
})
export class AdminModule {}
