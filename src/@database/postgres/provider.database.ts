import { Customer } from 'src/admin/models/crm/customer.model';
import { Post } from 'src/admin/models/crm/post.model';
import { Event } from 'src/admin/models/crm/event.model';
import { ConnectionOptions, createConnection } from 'typeorm';


export const DatabaseProviders = [
  {
    provide: 'CRM_CONNECTION',
    useFactory: async () => await createConnection({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        // __dirname+'../../../../../src/**/*.model{.ts,.js}',
        Customer,
        Event,
        Post
      ],
      synchronize: true,
    } as ConnectionOptions) ,
  },{
    provide: 'MOZ_CONNECTION',
    useFactory: async () => await createConnection({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_MOZ_DATABASE,
      entities: [
        // __dirname+'../../../../../src/**/*.model{.ts,.js}',
       
      ],
      synchronize: true,
    } as ConnectionOptions) ,
  },
];

