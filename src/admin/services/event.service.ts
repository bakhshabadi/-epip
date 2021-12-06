import { Inject, Injectable } from '@nestjs/common';
import { BaseService, IResponse } from '@lib/epip-crud';
import { Connection, IsNull, Repository } from 'typeorm';
import { DB_Providers } from 'src/@database/enums/db.enum';
import * as Model from '../models/crm/';
import to from 'await-to-js';
import { Request } from 'express';
import { KavenegarService } from './kavenegar.service';
import { TemplateType } from '../enums/kavenegar.type';
import { AvanakService } from './avanak.service';
import { ConstService } from '../enums/event.type';

@Injectable()
export class EventService extends BaseService<Model.Event>{
  constructor(
    @Inject('EVENT_REPOSITORY')
    public eventRepo: Repository<Model.Event>,
    @Inject('CUSTOMER_REPOSITORY')
    public customerRepo: Repository<Model.Customer>,
    private kavenegar: KavenegarService,
    private avanak: AvanakService
  ) {
    super(eventRepo)
  }

  public sendRuleSms(event:Model.Event, customer: Model.Customer,details: string){
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

  private async checkCustomerForModerator(modratorId:number,customerId:number): Promise<Model.Customer> {
    return this.customerRepo.findOne({
      where: {
        id: customerId,
        moderator_id: modratorId
      },
    })

  }

  public async doneEvent(req: Request, modratorId:number,customerId:number , eventId:number): Promise<IResponse<boolean>> {
    let [err, result] = await to(this.checkCustomerForModerator(modratorId,customerId));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<boolean>;
    }
    if (!result) {
      return {
        status: 403,
        message: 'این مشتری متعلق به شما نمی باشد',
      } as IResponse<boolean>;
    }

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
      let customer= await this.customerRepo.findOne(customerId);

      this.addEvent(req,{
        customer_id:customerId,
        event:{
          subject:ConstService.EventStatus.sendSurvay,
          deleted_at:null,
          details: customer.name,
          is_done: '',
          is_auto_service: true, //سیستم به صورت اتومات کار را انجام میدهد
          event_time: new Date(Date.now()+(+process.env.SEND_SURVAY_TIME_HOUR*3600*1000))
        } as Model.Event,
        moderator_id:modratorId
      },'');

      let avanakTime=new Date(Date.now()+(+process.env.SEND_AVANAK_CALL_TIME_HOUR*3600*1000));
      avanakTime.setHours(+process.env.SEND_AVANAK_CALL_AFTER_TIME_HOUR);
      
      this.addEvent(req,{
        customer_id:customerId,
        event:{
          subject:ConstService.EventStatus.avanakCall,
          deleted_at:null,
          details: customer.name,
          is_done: '',
          is_auto_service: true, //سیستم به صورت اتومات کار را انجام میدهد
          event_time: avanakTime
        } as Model.Event,
        moderator_id:modratorId
      },'');

      this.addEvent(req,{
        customer_id:customerId,
        event:{
          subject:ConstService.EventStatus.trackOrder,
          deleted_at:null,
          details: customer.name+"("+customer.phone+"): جهت پیگیری 'خرید' تماس گرفته شود",
          is_done: null,
          is_auto_service: false, 
          event_time: new Date(Date.now()+(+process.env.TRACK_ORDER_TIME_HOUR*3600*1000))
        } as Model.Event,
        moderator_id:modratorId
      },'');

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

  public async removeEvent(req: Request, modratorId:number,customerId:number , eventId:number): Promise<IResponse<boolean>> {
    let [err, result] = await to(this.checkCustomerForModerator(modratorId,customerId));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<boolean>;
    }
    if (!result) {
      return {
        status: 403,
        message: 'این مشتری متعلق به شما نمی باشد',
      } as IResponse<boolean>;
    }

    let [err1, result1] = await to(this.repo.update(eventId, {
      deleted_at:new Date()
    }));
    if (err1) {
      return {
        status: 500,
        message: err1.message,
      } as IResponse<boolean>;
    }

    if (result1?.affected) {
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
  

  public async addEvent(req: Request, entity: Model.IAddEvent,subscribeName: string): Promise<IResponse<Model.Event>> {
    let [err, result] = await to(this.checkCustomerForModerator(entity.moderator_id,entity.customer_id));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<Model.Event>;
    }
    if (!result) {
      return {
        status: 403,
        message: 'این مشتری متعلق به شما نمی باشد',
      } as IResponse<Model.Event>;
    }

    (entity as any).inserted_at = new Date()
    const [err1, result1] = await to(this.eventRepo.save(entity.event));
    if (err1) {
      return {
        status: 500,
        message: err1.message,
      } as IResponse<Model.Event>;
    }

    const [err2, result2] = await to(this.eventRepo.query(`
      insert into customer_events_event ("customerId","eventId") values(${entity.customer_id},${result1.id})
    `));

    if (err2) {
      return {
        status: 500,
        message: err2.message,
      } as IResponse<Model.Event>;
    }

    const [err3, result3] = await to(
      this.customerRepo.findOne({
        where: {
          id:entity.customer_id,
          deleted_at: IsNull(),
        },
      })
    );
    if (err3) {
      return {
        status: 500,
        message: err2.message,
      } as IResponse<Model.Event>;
    }

    this.sendRuleSms(entity.event,result3,subscribeName)

    return {
      status: 201,
      message: 'اطلاعات به درستی ثبت گردید',
      result: result2
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