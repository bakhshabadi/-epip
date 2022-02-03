import { Inject, Injectable, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { DB_Providers } from 'src/@database/enums/db.enum';
import { Person } from '../models/moz/model.model';
import to from 'await-to-js';
import { IResponse } from '@lib/epip-crud';
import { ConstService } from '../enums/event.type';
import { AvanakService } from './avanak.service';
import { KavenegarService } from './kavenegar.service';
import { TemplateType } from '../enums/kavenegar.type';
import { Event } from '../models';
import { Request } from "express";
import * as _ from 'lodash';

@Injectable()
export class PersonService {
  constructor(
    @Inject('MOZ_REPOSITORY')
    private repo: Repository<any>,

    @Inject('EVENT_REPOSITORY')
    public eventRepo:Repository<Event>,

    private avanak: AvanakService,
    private kavenegar: KavenegarService,
  ) {
  }

  public async getUsers(req: Request): Promise<any>{
    const [err,data]= await to(this.repo.query(`
      select
        au.id,
        au.name,
        au.phone,
        au.moderator_id,
        (select name from auther_user au1 where au1.id=au.moderator_id) moderator_name,
        bp.manager_name,
        (
            select string_agg(ar.name,',')
            from auther_role ar
            inner join auther_user_roles aur on ar.id = aur.role_id
            where aur.user_id=au.id
        ) role_name,
        (
            select string_agg(aur.role_id::varchar,',')
            from auther_user_roles aur
            where aur.user_id=au.id
        ) role_ids,
        (select count(*) from auther_session ase where ase.user_id=au.id) session_count
        ,(
            select bp2.inserted_at
            from bon_property bp2
            where bp2.seller_id=au.id
            order by bp2.inserted_at desc
            limit 1
        ) last_created
      from auther_user au
      inner join bon_person bp on au.id = bp.user_ptr_id
      order by last_created desc
      limit ${req.query.limit || 10} offset ${req.query.offset || 0}
    `));
    if(err){
      return new Promise((_,rej)=>{
        rej('خطا در سرور');
      })
    }

    return new Promise((res,_)=>{
      res(data)
    })

    // return _(data).orderBy(['last_created','desc']).value();
  }

  private readonly logger = new Logger(PersonService.name);

  public async autoJob() {
    let [err, data] = await to(this.repo.query(`
      select
        au.id,
        au.phone,
        au.name,
        bp.manager_name agency,
        au.moderator_id,
        ce.id as event_id,
        ce.subject as event_subject,
        ce.details as event_details,
        ce."inserted_at" as "event_inserted_at",
        ce.is_done as event_is_done
      from auther_user au
      inner join bon_person bp on bp.user_ptr_id=au.id
      inner join crm_event ce on ce.user_id=au.id
      where now() >= ce.event_time and (ce.is_done is null or ce.is_done='') and ce.is_auto_service=true and ce.deleted_at is null
    `));

    if (err) {
      this.logger.error(err.message)
    }

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      switch (element.event_subject) {
        case ConstService.EventStatus.sendSurvay:
          this.kavenegar.sendOtp(element.phone, TemplateType.Survey, [element.name]);
          await this.eventRepo.update(element.event_id, {
            is_done: 'send'
          })
          break;
        case ConstService.EventStatus.avanakCall:
          this.avanak.sendVoiceMessage(element.phone);
          await this.eventRepo.update(element.event_id, {
            is_done: 'send'
          })
          break;
      }

    }
  }

  public trackingCustomer(): Promise<Array<Person>> {
    return this.repo.query(`
      select distinct on (bp.user_ptr_id)  user_id,
        au.name,
        au.phone,
        bp.manager_name agency,
        au.moderator_id,
        ce.id as event_id,
        ce.subject as event_subject,
        ce.details as event_details,
        ce.inserted_at as event_inserted_at,
        ce.is_done as event_is_done
      from bon_person bp
      inner join auther_user au on au.id=bp.user_ptr_id
      join (
        select * from crm_event ce order by id desc
      ) ce on ce.user_id=bp.user_ptr_id
    `) as Promise<Array<Person>>
  }

  public fetchPerson(): Promise<Array<Person>> {
    return this.repo.query(`
      select
          au.id,
          bp.seller_id seller_id,
          au.phone phone,
          au.name,
          count(*) count
      from bon_property bp
      inner join auther_user au on au.id = bp.seller_id
      where (
          select count(*)
          from auther_user_roles ar
          where ar.user_id = au.id
          and (ar.role_id =4 or ar.role_id=6)
      )=0
      and now() <= (bp.inserted_at + 90 * INTERVAL '1 day')
      and bp.seller_id not in (
        SELECT seller_id FROM dblink('dbname=${process.env.DB_DATABASE}','select moz_id from ${process.env.DB_DATABASE}.public.customer') as t1(seller_id integer)
      )
      group by bp.seller_id,au.phone,au.name, au.id
      order by count(*) desc
    `) as Promise<Array<Person>>
  }

  public async deleteFreeOrders(userId) {
    let sql = `
      delete
      from purchase_item
      where order_id in (
          select po.id
          from purchase_order po
          inner join purchase_item pi on po.id = pi.order_id
          where po.user_id = $1
            and pi.product_id in (527,528)
      )
    `;

    let [err, _] = await to(this.repo.query(sql, [userId]));
    if (err) {
      return new Promise((_, rej) => {
        rej('خطا در سرور')
      })
    }

    sql = `
      delete
      from purchase_order
      where id in (
          select po.id
          from purchase_order po
          inner join purchase_item pi on po.id = pi.order_id
          where po.user_id = $1
            and pi.product_id in (527)
      )
    `;
    this.repo.query(sql, [userId]);
  }

  public async setRole(userId, postId) {
    let sql = "select * from auther_user_roles where user_id=$1 and role_id=$2"
    let [err, data] = await to(this.repo.query(sql, [userId, postId == 1 ? 4 : 6]));
    if (err) {
      return new Promise((_, rej) => {
        rej('خطا در ارتباط با سرور')
      })
    }
    if (data.length) {
      return new Promise((res, _) => {
        res(true)
      })
    }

    return await this.repo.query(`
      insert into auther_user_roles(user_id,role_id)values(
        ${userId},${postId == 1 ? 4 : 6}
      )
    `);
  }



  // public async addPerson(entity:Customer):Promise<any>{
  //   let res= await this.repo.query(`
  //     select bp.* from bon_person bp
  //     inner join auther_user aur on bp.user_ptr_id=aur.id
  //     where aur.phone = $1
  //   `,[entity.phone]);

  //   if(res.length){
  //     let res1 = await this.setRole(res[0]["user_ptr_id"],entity.post.id);
  //     if(!res1){
  //       return new Promise((_,rej)=>{
  //         return rej('خطا در ثبت نقش مشتری')
  //       });
  //     }

  //     return new Promise((resolve,_)=>{
  //       return resolve(res[0]["user_ptr_id"])
  //     });
  //   }

  //   res= await this.repo.query(`
  //     insert into auther_user (
  //       deleted_at,
  //       inserted_at,
  //       updated_at,
  //       name,
  //       username,
  //       email,
  //       phone,
  //       password,
  //       active,
  //       expire,
  //       domain_id,
  //       parent_id,
  //       max_session,
  //       max_view_property
  //     )values(
  //       null,
  //       now(),
  //       now(),
  //       $1,
  //       $2,
  //       null,
  //       $3,
  //       '',
  //       true,
  //       null,
  //       null,
  //       null,
  //       1,
  //       60
  //     )
  //   `,[
  //       entity.name,
  //       entity.phone,
  //       entity.phone,
  //     ]);


  //     if(!res){
  //       return new Promise((_,rej)=>{
  //         return rej('خطا در ثبت مشتری')
  //       });
  //     }

  //     if(res){
  //       res= await this.repo.query(`SELECT last_value from auther_user_id_seq`);
  //       if(!res){
  //         return new Promise((_,rej)=>{
  //           return rej('خطا در ثبت مشتری و دریافت کد')
  //         });
  //       }
  //       let res1=await this.repo.query(`
  //       insert into bon_person(
  //         user_ptr_id,
  //         manager_name,
  //         latitude,
  //         longitude,
  //         legal_entity,
  //         natural_person,
  //         vip,
  //         counter_view,
  //         date_counter_view
  //       )values(
  //         ${res[0].last_value},
  //         $1,
  //         null,
  //         null,
  //         false,
  //         false,
  //         false,
  //         0,
  //         null
  //       )`,[entity.agency])

  //       if(!res1){
  //         return new Promise((_,rej)=>{
  //           return rej('خطا در ثبت نهایی مشتری')
  //         });
  //       }
  //       res1 = await this.setRole(res[0].last_value,entity.post.id);
  //       if(!res1){
  //         return new Promise((_,rej)=>{
  //           return rej('خطا در ثبت نقش مشتری')
  //         });
  //       }

  //       return new Promise((resolve,_)=>{
  //         resolve(res[0].last_value);
  //       });

  //     }
  // }


  // public async moveToCrm(id: number):Promise<IResponse<Customer>>{
  //   let [err,data] = await to(this.customerRepo.find({
  //     relations:['events','post'],
  //     where:{
  //       moz_id: id
  //     }
  //   }));

  //   if(err){
  //     return {
  //       status:500,
  //       message: err.message,
  //       result: null
  //     }
  //   }

  //   if(data.length){
  //     return {
  //       status:201,
  //       message: "کاربر مورد نظر در سیستم یافت گردید",
  //       result: data[0]
  //     }
  //   }

  //   let [err2,people] = await to(this.repo.query(`
  //     select au.id, au.phone phone,au.name from auther_user au
  //     where
  //       au.id=$1
  //   `,[id]));

  //   if(err2){
  //     return {
  //       status:500,
  //       message: err2.message,
  //       result: null
  //     }
  //   }

  //   const element = new Customer()
  //   element.name=people[0].name || "";
  //   element.seller_id=people[0].seller_id;
  //   element.agency='';
  //   element.address='';
  //   element.phone=people[0].phone;
  //   element.count_ads=people[0].count;
  //   element.moz_id=people[0].id;

  //   let res= await this.crmService.post(null,element);

  //   if(res.status!=201){
  //     return {
  //       status:500,
  //       message:res.message,
  //       result: null
  //     }
  //   }

  //   return {
  //     status:201,
  //     message: "عملیات به درستی صورت گرفت",
  //     result: res.result
  //   }

  // }
}

export const PersonProviders = [
  {
    provide: 'MOZ_REPOSITORY',
    useFactory: (connection: Connection) => connection.manager,
    inject: [DB_Providers.MOZ_CONNECTION],
  },
];