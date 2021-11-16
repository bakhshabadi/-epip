import { Inject, Injectable } from '@nestjs/common';
import { BaseService, IResponse} from '@lib/epip-crud';
import { Connection, Repository } from 'typeorm';
import { Customer } from '../models/crm/customer.model';
import { DB_Providers } from 'src/@database/enums/db.enum';
import { Person } from '../models/moz/model.model';

@Injectable()
export class PersonService{
  constructor(
    @Inject('PERSON_REPOSITORY')
    private repo:Repository<any>
  ){
  }

  public fetchPerson():Promise<Array<Person>>{
    return this.repo.query(`
      select bp.seller_id seller_id,au.phone phone,au.name,count(*) count from bon_property bp
      inner join auther_user au on au.id = bp.seller_id
      inner join auther_user_roles ar on ar.user_id = bp.seller_id
      where
        ar.role_id not in (4,6)
        and now() <= (bp.inserted_at + 90 * INTERVAL '1 day')
        and bp.seller_id not in (
            SELECT seller_id FROM dblink('dbname=db1','select seller_id from db1.public.customer') as t1(seller_id integer)
          )
      group by bp.seller_id,au.phone,au.name
      having count(*)>=5
      order by count(*) desc
    `) as Promise<Array<Person>>
  }
  
}

export const PersonProviders = [
  {
    provide: 'PERSON_REPOSITORY',
    useFactory: (connection: Connection) => connection.manager,
    inject: [DB_Providers.MOZ_CONNECTION],
  },
];