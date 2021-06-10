import { KyHocModule } from './modules/ky-hoc/ky-hoc.module';
import { LopModule } from './modules/lop/lop.module';
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpExceptionFilter } from "./common/exception/http-exception.filter";
import { TransformResponseInterceptor } from "./common/pipe/transform-response.intercepter";
import configuration from "./config/configuration";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { RepositoryModule } from "./modules/repository/repository.module";
import { SettingModule } from "./modules/setting/setting.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>("database.host");
        const dbPort = configService.get<number>("database.port");
        const dbName = configService.get<string>("database.name");
        return {
          uri: `mongodb://${dbHost}:${dbPort}/${dbName}?authSource=admin`,
          user: configService.get("database.username"),
          pass: configService.get("database.password"),
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
          retryDelay: 5000,
        };
      },
      inject: [ConfigService],
    }),
    RepositoryModule,
    AuthModule,
    UserModule,
    ProfileModule,
    SettingModule,
    AttendanceModule,
    LopModule,
    KyHocModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule { }
