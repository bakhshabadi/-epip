import { Users } from 'src/admin/models/users.model';
import { ConnectionOptions, createConnection } from 'typeorm';


export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        // __dirname+'../../../../../src/**/*.model{.ts,.js}',
        Users
      ],
      synchronize: true,
    } as ConnectionOptions) ,
  },
];