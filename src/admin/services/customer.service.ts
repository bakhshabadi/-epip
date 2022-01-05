// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { BaseService, IResponse, IResponseAll} from '@lib/epip-crud';
// import { Connection, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
// import { DB_Providers } from 'src/@database/enums/db.enum';
// import to from 'await-to-js';
// import { ConstService } from '../enums/event.type';
// import { AvanakService } from './avanak.service';
// import { KavenegarService } from './kavenegar.service';
// import { TemplateType } from '../enums/kavenegar.type';
// // import { Customer, Event } from '../models/crm';
// import * as _ from "lodash";

// @Injectable()
// export class CustomerService extends BaseService<Customer>{
//   constructor(
//     @Inject('CUSTOMER_REPOSITORY')
//     public repo:Repository<Customer>,

//     @Inject('EVENT_REPOSITORY')
//     public eventRepo:Repository<Event>,

//     private avanak: AvanakService,
//     private kavenegar: KavenegarService,
//   ){
//       super(repo,['post','events'])
//   }
//   private readonly logger = new Logger(CustomerService.name);

//   public async trackingCustomer():Promise<[any, undefined] | [null, Customer[]]>{
//     return await to(this.repo.query(`
//       select
//         c.id,
//         c.phone,
//         c.name,
//         c.agency,
//         c.moz_id,
//         c.moderator_id,
//         (
//             select e.id from customer_events_event
//             inner join event e on customer_events_event."eventId" = e.id
//             where "customerId"=c.id and e.inserted_at is not null
//             and e.is_auto_service=false and e.deleted_at is null
//             and (e.event_time - INTERVAL '${210+(+process.env.TRACKING_NOTIF_MIN)} MINUTES') <= now() 
//             order by e.inserted_at desc
//             limit 1
//         ) as event_id,
//       (
//             select e.subject from customer_events_event
//             inner join event e on customer_events_event."eventId" = e.id
//             where "customerId"=c.id and e.inserted_at is not null
//             and e.is_auto_service=false and e.deleted_at is null
//             and (e.event_time - INTERVAL '${210+(+process.env.TRACKING_NOTIF_MIN)} MINUTES') <= now() 
//             order by e.inserted_at desc
//             limit 1
//         ) as event_subject,
//         (
//             select e.details from customer_events_event
//             inner join event e on customer_events_event."eventId" = e.id
//             where "customerId"=c.id and e.inserted_at is not null
//             and e.is_auto_service=false and e.deleted_at is null
//             and (e.event_time - INTERVAL '${210+(+process.env.TRACKING_NOTIF_MIN)} MINUTES') <= now() 
//             order by e.inserted_at desc
//             limit 1
//         )  as event_details,
//       (
//             select e.inserted_at from customer_events_event
//             inner join event e on customer_events_event."eventId" = e.id
//             where "customerId"=c.id and e.inserted_at is not null
//             and e.is_auto_service=false and e.deleted_at is null
//             and (e.event_time - INTERVAL '${210+(+process.env.TRACKING_NOTIF_MIN)} MINUTES') <= now() 
//             order by e.inserted_at desc
//             limit 1
//         )  as "event_inserted_at",
//       (
//             select e.is_done from customer_events_event
//             inner join event e on customer_events_event."eventId" = e.id
//             where "customerId"=c.id and e.inserted_at is not null
//             and e.is_auto_service=false and e.deleted_at is null
//             and (e.event_time - INTERVAL '${210+(+process.env.TRACKING_NOTIF_MIN)} MINUTES') <= now() 
//             order by e.inserted_at desc
//             limit 1
//         )  as event_is_done
//       from customer c
//       where c.moderator_id=609424 and (
//           select count(*) from customer_events_event
//           inner join event e on customer_events_event."eventId" = e.id
//           where "customerId"=c.id and e.is_done is null and e.is_auto_service=false and e.deleted_at is null
//       )>0
//     `));
//   }

//   public async autoJob(){
//     let [err,data] =await to(this.repo.query(`
//       select 
//         c.id,
//         c.phone,
//         c.name,
//         c.agency,
//         c.moderator_id,
//         e.id as event_id,
//         e.subject as event_subject,
//         e.details as event_details,
//         e."inserted_at" as "event_inserted_at",
//         e.is_done as event_is_done
//       from customer c
//       inner join customer_events_event ce on c.id=ce."customerId"
//       inner join event e on e.id=ce."eventId"
//       where now() >= e.event_time and (e.is_done is null or e.is_done='') and is_auto_service=true and e.deleted_at is null
//     `));

//     if(err){
//       this.logger.error(err.message)
//     }

//     for (let i = 0; i < data.length; i++) {
//       const element = data[i];
//       switch (element.event_subject) {
//         case ConstService.EventStatus.sendSurvay:
//           this.kavenegar.sendOtp(element.phone,TemplateType.Survey,[element.name]);
//           await this.eventRepo.update(element.event_id,{
//             is_done:'send'
//           })
//           break;
//         case ConstService.EventStatus.avanakCall:
//           this.avanak.sendVoiceMessage(element.phone);
//           await this.eventRepo.update(element.event_id,{
//             is_done:'send'
//           })
//           break;
//       }
      
//     }

//   }


//   public async getCustomers(req,modratorId:number, district_id:number):Promise<IResponseAll<Customer>>{
//     let sql=`
//     SELECT 
//       e.id as event_id,
//       e.inserted_at as event_inserted_at,
//       e.updated_at as event_updated_at,
//       e.deleted_at as event_deleted_at,
//       e.subject as event_subject,
//       e.details as event_details,
//       e.event_time as event_event_time,
//       e.is_auto_service as event_is_auto_service,
//       e.is_done as event_is_done,
//       c.*, 
//       t1.count count_ads 
//     FROM dblink('dbname=moz','
//       select bp.seller_id, count(*) count from bon_property bp
//       inner join bon_neighborhood bn on bn.product_ptr_id=bp.neighborhood_id
//       where bn.district_id=${district_id}
//       group by bp.seller_id
//     ') as t1(seller_id bigint,count integer)
//     inner join customer c on c.moz_id=t1.seller_id
//     left join customer_events_event ee on ee."customerId"=c.id
//     left join event e on e.id=ee."eventId"
//     ${
//       (()=>{
//         let where=[];
//         if(req.query.moderator_name__isnull){
//           where.push('c.moderator_name is null')
//         }
//         if(req.query.phone__contains){
//           where.push(`c.phone::varchar like '%${req.query.phone__contains}%'`)
//         }
//         if(req.query.moderator_id){
//           where.push(`c.moderator_id = ${req.query.moderator_id}`)
//         }

//         return where.length ? ' where ' + where.join (' and '): '';
//       })()
//     }
//     order by t1.count desc
//     limit ${req.query.limit || 15} offset ${req.query.offset || 0};
//     `
//     console.log(sql)
//     let data:Array<Customer> = await this.repo.query(sql)
//     data=_(data).groupBy(f=>f.id).value();
//     data=_(data).map(f=>({
//       address: f[0].address,
//       advantages: f[0].advantages,
//       agency: f[0].agency,
//       competitor: f[0].competitor,
//       count_ads: f[0].count_ads,
//       deleted_at: f[0].deleted_at,
//       disadvantages: f[0].disadvantages,
//       filing_rate: f[0].filing_rate,
//       id: f[0].id,
//       inserted_at: f[0].inserted_at,
//       is_video_record: f[0].is_video_record,
//       moderator_id: f[0].moderator_id,
//       moderator_name: f[0].moderator_name,
//       moz_id: f[0].moz_id,
//       name: f[0].name,
//       phone: f[0].phone,
//       postId: f[0].postId,
//       seller_id: f[0].seller_id,
//       status: f[0].status,
//       subject: f[0].subject,
//       support_rate: f[0].support_rate,
//       updated_at: f[0].updated_at,
//       events:f.filter(f=>f.event_id).map(f=>({
//         id: f.event_id,
//         inserted_at: f.event_inserted_at,
//         updated_at: f.event_updated_at,
//         deleted_at: f.event_deleted_at,
//         subject: f.event_subject,
//         details: f.event_details,
//         event_time: f.event_event_time,
//         is_auto_service: f.event_is_auto_service,
//         is_done: f.event_is_done,
//       }))
//     })).value();
//     return {
//       status : 200,
//       results : data,
//       message : "",
//     } as IResponseAll<Customer>;
//   }
// }

// export const CustomerProviders = [
//   {
//     provide: 'CUSTOMER_REPOSITORY',
//     useFactory: (connection: Connection) => connection.getRepository(Customer),
//     inject: [DB_Providers.CRM_CONNECTION],
//   },
// ];