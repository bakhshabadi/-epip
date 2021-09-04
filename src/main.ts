import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./@app/app.module";
import * as helmet from "helmet";
// import * as dotenv from "dotenv";
// import * as csurf from 'csurf';
// import * as cookieParser from 'cookie-parser';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser())
  // app.use(csurf());
  app.use(helmet());

  const swConfig = new DocumentBuilder()
    .setTitle("Sample Apis")
    .setDescription("The sample API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swConfig);
  SwaggerModule.setup("api", app, document);

  app.enableCors();

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}
bootstrap();
