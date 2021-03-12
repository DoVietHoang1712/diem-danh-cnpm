import { accessibleFieldsPlugin, accessibleRecordsPlugin } from "@casl/mongoose";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as mongoose from "mongoose";
import { AppModule } from "./app.module";
import { Environment } from "./config/configuration";

async function bootstrap() {
  mongoose.plugin(accessibleRecordsPlugin);
  mongoose.plugin(accessibleFieldsPlugin);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const environment = configService.get<Environment>("server.env");

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: environment === Environment.PRODUCTION,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(process.env.npm_package_name)
    .setVersion("0.0.1")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      displayRequestDuration: true,
    },
  });

  const port = configService.get<number>("server.port");
  app.enableCors();
  await app.listen(port);
}
bootstrap();
