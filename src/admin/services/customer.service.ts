import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseService, IResponse} from '@lib/epip-crud';
import { Connection, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { DB_Providers } from 'src/@database/enums/db.enum';
import to from 'await-to-js';
import { ConstService } from '../enums/event.type';
import { AvanakService } from './avanak.service';
import { KavenegarService } from './kavenegar.service';
import { TemplateType } from '../enums/kavenegar.type';
import { Customer, Event } from '../models/crm';

@Injectable()
export class CustomerService extends BaseService<Customer>{
  constructor(
    @Inject('CUSTOMER_REPOSITORY')
    public repo:Repository<Customer>,

    @Inject('EVENT_REPOSITORY')
    public eventRepo:Repository<Event>,

    private avanak: AvanakService,
    private kavenegar: KavenegarService,
  ){
      super(repo,['post','events'])
  }
  private readonly logger = new Logger(CustomerService.name);

  public async trackingCustomer():Promise<[any, undefined] | [null, Customer[]]>{
    return await to(this.repo.query(`
      select 
        c.id,
        c.phone,
        c.name,
        c.agency,
        c.moz_id,
        c.moderator_id,
        e.id as event_id,
        e.subject as event_subject,
        e.details as event_details,
        e."inserted_at" as "event_inserted_at",
        e.is_done as event_is_done
      from customer c
      inner join customer_events_event ce on c.id=ce."customerId"
      inner join event e on e.id=ce."eventId"
      where (e.event_time - INTERVAL '${210+(+process.env.TRACKING_NOTIF_MIN)} MINUTES') <= now() and e.is_done is null and is_auto_service=false and e.deleted_at is null
    `));
  }

  public async autoJob(){
    let [err,data] =await to(this.repo.query(`
      select 
        c.id,
        c.phone,
        c.name,
        c.agency,
        c.moderator_id,
        e.id as event_id,
        e.subject as event_subject,
        e.details as event_details,
        e."inserted_at" as "event_inserted_at",
        e.is_done as event_is_done
      from customer c
      inner join customer_events_event ce on c.id=ce."customerId"
      inner join event e on e.id=ce."eventId"
      where now() >= e.event_time and (e.is_done is null or e.is_done='') and is_auto_service=true and e.deleted_at is null
    `));

    if(err){
      this.logger.error(err.message)
    }

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      switch (element.event_subject) {
        case ConstService.EventStatus.sendSurvay:
          this.kavenegar.sendOtp(element.phone,TemplateType.Survey,[element.name]);
          await this.eventRepo.update(element.event_id,{
            is_done:'send'
          })
          break;
        case ConstService.EventStatus.avanakCall:
          this.avanak.sendVoiceMessage(element.phone);
          await this.eventRepo.update(element.event_id,{
            is_done:'send'
          })
          break;
      }
      
    }

  }

}

export const CustomerProviders = [
  {
    provide: 'CUSTOMER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Customer),
    inject: [DB_Providers.CRM_CONNECTION],
  },
];