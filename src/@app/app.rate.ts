import { ThrottlerModule } from "@nestjs/throttler";

export const AppRate = ThrottlerModule.forRoot({
  ttl: 1,
  limit: 5,
});
