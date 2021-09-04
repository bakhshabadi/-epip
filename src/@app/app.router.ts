import { RouterModule } from "@nestjs/core";
import { AdminModule } from "../admin/admin.module";

export const AppRouter = RouterModule.register([
  {
    path: "Admin",
    module: AdminModule,
  },
]);
