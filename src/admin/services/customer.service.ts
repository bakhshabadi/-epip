import { Inject, Injectable } from '@nestjs/common';
import { BaseService, IResponse} from '@lib/epip-crud';
import { Connection, Repository } from 'typeorm';
import { Customer } from '../models/crm/customer.model';
import { DB_Providers } from 'src/@database/enums/db.enum';

@Injectable()
export class CustomerService extends BaseService<Customer>{
  constructor(
    @Inject('CUSTOMER_REPOSITORY')
    repo:Repository<Customer>
  ){
      super(repo,['post','events'])
  }

}

export const CustomerProviders = [
  {
    provide: 'CUSTOMER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Customer),
    inject: [DB_Providers.CRM_CONNECTION],
  },
];