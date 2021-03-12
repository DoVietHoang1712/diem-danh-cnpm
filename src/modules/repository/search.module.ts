// import { SettingSearchService } from "./../setting/service/setting-search.service";
// import { Global } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { ConfigModule } from "@nestjs/config";
// import { Module } from "@nestjs/common";
// import { ElasticsearchModule } from "@nestjs/elasticsearch";
// @Global()
// @Module({
//     imports:[
//         ConfigModule,
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//         ElasticsearchModule.registerAsync({
//             imports: [ConfigModule],
//             useFactory: async (configService: ConfigService) => ({
//                 node: configService.get("ELASTICSEARCH_NODE"),
//                 auth: {
//                     username: configService.get("ELASTICSEARCH_USERNAME"),
//                     password: configService.get("ELASTICSEARCH_PASSWORD"),
//                 },
//             }),
//             inject: [ConfigService],
//         }),
//     ],
//     providers: [SettingSearchService],
//     exports: [ElasticsearchModule, SettingSearchService],
// })

// export class SearchModule { }