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

  private sendRuleSms(event:Model.Event, customer: Model.Customer){
    switch (event.subject) {
      case "value1":
        this.kavenegar.sendOtp(customer.phone,TemplateType.Welcome,[customer.name]);
        break;
      case "value2":
        this.kavenegar.sendOtp(customer.phone,TemplateType.Welcome,[customer.name]);
        break;
      case "value3":
        this.kavenegar.sendOtp(customer.phone,TemplateType.Welcome,[customer.name]);
        this.avanak.sendVoiceMessage(customer);
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
      is_done:true
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
  

  public async addEvent(req: Request, entity: Model.IAddEvent): Promise<IResponse<Model.Event>> {
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

    (entity as any).insertedAt = new Date()
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
          deletedAt: IsNull(),
        },
      })
    );
    if (err3) {
      return {
        status: 500,
        message: err2.message,
      } as IResponse<Model.Event>;
    }

    this.sendRuleSms(entity.event,result3)

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