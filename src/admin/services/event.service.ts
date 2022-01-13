import { Inject, Injectable } from '@nestjs/common';
import { BaseService, IResponse } from '@lib/epip-crud';
import { Connection, Repository } from 'typeorm';
import { DB_Providers } from 'src/@database/enums/db.enum';
import * as Model from '../models/';
import { KavenegarService } from './kavenegar.service';
import { AvanakService } from './avanak.service';
import to from 'await-to-js';
import { ConstService } from '../enums/event.type';
import { TemplateType } from '../enums/kavenegar.type';
import { Request } from "express";

@Injectable()
export class EventService extends BaseService<Model.Event>{
  constructor(
    @Inject('EVENT_REPOSITORY')
    public eventRepo: Repository<Model.Event>,
    // @Inject('CUSTOMER_REPOSITORY')
    // public customerRepo: Repository<Model.Customer>,

    private kavenegar: KavenegarService,
    private avanak: AvanakService
  ) {
    super(eventRepo)
  }

  public sendRuleSms(event:Model.Event, customer: Model.IUser,details: string){
    switch (event.subject) {
      case ConstService.EventStatus.buySubscribe:
        this.kavenegar.sendOtp(customer.phone,TemplateType.Welcome,[customer.name,details,customer.moderator_name]);
        break;
      case ConstService.EventStatus.customSubscribe:
        this.kavenegar.sendOtp(customer.phone,TemplateType.Welcome,[customer.name,details,customer.moderator_name]);
        break;
      case ConstService.EventStatus.trackOrder:
        this.kavenegar.sendOtp(customer.phone,TemplateType.Survey,[customer.name,customer.moderator_name]);
        break;
      case ConstService.EventStatus.buyFinalSubscribe:
        this.kavenegar.sendOtp(customer.phone,TemplateType.Welcome,[customer.name,details,customer.moderator_name]);
        this.avanak.sendVoiceMessage(customer.phone);
        break;
    }
  }

  // private async checkCustomerForModerator(modratorId:number,customerId:number): Promise<Model.Customer> {
  //   return this.customerRepo.findOne({
  //     where: {
  //       id: customerId,
  //       moderator_id: modratorId
  //     },
  //   })

  // }

  public async doneEvent(req: Request, eventId:number): Promise<IResponse<boolean>> {

    let [err1, result1] = await to(this.repo.update(eventId, {
      is_done:'yes'
    }));
    if (err1) {
      return {
        status: 500,
        message: err1.message,
      } as IResponse<boolean>;
    }

    if (result1?.affected) {
      this.addEvent(req,{
          subject:ConstService.EventStatus.sendSurvay,
          deleted_at:null,
          details: (req as any).currentUser.name,
          is_done: '',
          is_auto_service: true, //سیستم به صورت اتومات کار را انجام میدهد
          event_time: new Date(Date.now()+(+process.env.SEND_SURVAY_TIME_HOUR*3600*1000))
      } as Model.Event,'');

      let avanakTime=new Date(Date.now()+(+process.env.SEND_AVANAK_CALL_TIME_HOUR*3600*1000));
      avanakTime.setHours(+process.env.SEND_AVANAK_CALL_AFTER_TIME_HOUR);
      
      this.addEvent(req,{
          subject:ConstService.EventStatus.avanakCall,
          deleted_at:null,
          details: (req as any).currentUser.name,
          is_done: '',
          is_auto_service: true, //سیستم به صورت اتومات کار را انجام میدهد
          event_time: avanakTime
      } as Model.Event, '');

      this.addEvent(req,{
          subject:ConstService.EventStatus.trackOrder,
          deleted_at:null,
          details: (req as any).currentUser.name+"("+(req as any).currentUser.phone+"): جهت پیگیری 'خرید' تماس گرفته شود",
          is_done: null,
          is_auto_service: false, 
          event_time: new Date(Date.now()+(+process.env.TRACK_ORDER_TIME_HOUR*3600*1000))
      } as Model.Event,'');

      // this.kavenegar.sendOtp(result.phone,TemplateType.Survey,[result.name]);
      return {
        status: 200,
        message: "ok",
      };
    } else {
      return {
        status: 500,
        message: 'error !.',
      } as IResponse<boolean>;
    }
  }

  // public async removeEvent(req: Request, modratorId:number,customerId:number , eventId:number): Promise<IResponse<boolean>> {
  //   let [err, result] = await to(this.checkCustomerForModerator(modratorId,customerId));
  //   if (err) {
  //     return {
  //       status: 500,
  //       message: err.message,
  //     } as IResponse<boolean>;
  //   }
  //   if (!result) {
  //     return {
  //       status: 403,
  //       message: 'این مشتری متعلق به شما نمی باشد',
  //     } as IResponse<boolean>;
  //   }

  //   let [err1, result1] = await to(this.repo.update(eventId, {
  //     deleted_at:new Date()
  //   }));
  //   if (err1) {
  //     return {
  //       status: 500,
  //       message: err1.message,
  //     } as IResponse<boolean>;
  //   }

  //   if (result1?.affected) {
  //     return {
  //       status: 200,
  //       message: "ok",
  //     };
  //   } else {
  //     return {
  //       status: 500,
  //       message: 'error !.',
  //     } as IResponse<boolean>;
  //   }
  // }
  
  public async getUser(userId):Promise<Model.IUser>{
    let sql=`
      select au.* ,(select name from auther_user au1 where au1.id=au.moderator_id) as moderator_name
      from auther_user au
      
      where id=$1 and deleted_at is null`;
    let [err,data] = await to(this.repo.query(sql,[userId]));
    if(err){
      return new Promise((_,rej)=>{
        rej('خطا در ارتباط با سرور')
      })
    }
    if(!data.length){
      return new Promise((_,rej)=>{
        rej('کاربر مورد نظر یافت نشده است. احتمالا حذف شده است')
      })
    }

    return new Promise((res,_)=>{
      res(data[0] as Model.IUser)
    })
  }


  public async addEvent(req: Request, entity: Model.Event,subscribeName: string): Promise<IResponse<Model.Event>> {
    
    const [err0, res0] = await to(this.eventRepo.query(`
      select * from auther_user where id=$1
    `,[entity.user_id]));
    if (err0) {
      return {
        status: 500,
        message: err0.message,
      } as IResponse<Model.Event>;
    }
    if(!res0.length){
      return {
        status: 500.1,
        message: "کاربری یافت نشده است",
      } as IResponse<Model.Event>;
    }
    if(res0[0].moderator_id && res0[0].moderator_id!=(req as any).currentUser.user_id){
      return {
        status: 500.2,
        message: "این کاربر متعلق به شخص دیگری می باشد",
      } as IResponse<Model.Event>;
    }

    entity.inserted_at = new Date()
    const [err1, result1] = await to(this.eventRepo.save(entity));
    if (err1) {
      return {
        status: 501,
        message: err1.message,
      } as IResponse<Model.Event>;
    }

    const [err3, result3] = await to(
      this.getUser(entity.user_id)
    );
    if (err3) {
      console.log(err3)
      return {
        status: 502,
        message: (err3 as any),
      } as IResponse<Model.Event>;
    }

    this.sendRuleSms(entity,result3,subscribeName)

    const [err2, res2] = await to(this.eventRepo.query(`
      update auther_user set moderator_id=$1 where id=$2
    `,[(req as any).currentUser.user_id,entity.user_id]));
    if (err2) {
      return {
        status: 503,
        message: err2.message,
      } as IResponse<Model.Event>;
    }

    return {
      status: 201,
      message: 'اطلاعات به درستی ثبت گردید',
      result: result1
    } as IResponse<Model.Event>;
  }

}

export const EventProviders = [
  {
    provide: 'EVENT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Model.Event),
    inject: [DB_Providers.CRM_CONNECTION],
  },
];