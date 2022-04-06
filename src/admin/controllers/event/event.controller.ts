import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@lib/epip-crud";
import { Body, Param, Req, Post, Patch, Delete, Put } from "@nestjs/common";
import { Request } from "express";
import * as Model from "src/admin/models/crm";
import * as Kavenegar from "kavenegar";
import { EventService } from "src/admin/services/event.service";
import { AvanakService } from "src/admin/services/avanak.service";
import { KavenegarService } from "src/admin/services/kavenegar.service";

@ApiController(Model.Event)
export class EventController {
  constructor(private readonly service: EventService,private readonly a:AvanakService, private readonly k:KavenegarService) {
  }

  @Post(":subscribe")
  public async addEvent(@Req() req: Request,@Param() param , @Body() entity:Model.Event): Promise<IResponse<Model.Event>>{
    return await this.service.addEvent(req, entity, param.subscribe);
  }

  @Put("/send")
  public async send(@Req() req: Request): Promise<IResponse<any>>{
    // this.a.sendVoiceMessage({phone:9157006634} as Customer)
    this.k.sendOtp(9054400067,'welcome',[ 'ایمان شعیبی', 'سه روزه', 'شیما شعیبی' ]);
    return {
      status: 201,
      message: "پیام با موفقیت ارسال شد"
    } as IResponse<string>;
  }

  // @Patch(":id")
  // public async patch(@Req() req: Request, @Param() param, @Body() entity:Model.Event): Promise<IResponse<Model.Event>>{
  //   return await this.service.patch(req, param.id, entity);
  // }
  
  @Patch(":eventId")
  public async doneEvent(@Req() req: Request, @Param() param): Promise<IResponse<boolean>>{
    return await this.service.doneEvent(req, param.eventId);
  }

  // @Delete(":modaratorId/:customerId/:eventId")
  // public async removeEvent(@Req() req: Request, @Param() param): Promise<IResponse<boolean>>{
  //   return await this.service.removeEvent(req, param.modaratorId, param.customerId, param.eventId);
  // }

  @ApiGetAll(Model.Event)
  public async getAll(@Req() req: Request): Promise<IResponseAll<Model.Event>>  {
    return await this.service.getAll(req);
  }

  // @ApiGet(Event,':id')
  // public async get(@Req() req: Request, @Param() param): Promise<IResponse<Event>>  {
  //   return await this.service.get(req,param.id);
  // }

  // @ApiPost(Event)
  // public async post(@Req() req: Request, @Body() entity:Event): Promise<IResponse<Event>>  {
  //   return await this.service.post(req,entity);
  // }

  // @ApiPut(Event,':id')
  // public async put(@Req() req: Request, @Param() param,@Body() entity:Event): Promise<IResponse<Event>>  {
  //   return await this.service.put(req,param.id,entity);
  // }

  // @ApiPatch(Event,':id')
  // public async patch(@Req() req: Request, @Param() param,@Body() entity:Event): Promise<IResponse<Event>>  {
  //   return await this.service.patch(req,param.id,entity);
  // }

  // @ApiDelete(Event,':id')
  // public async delete(@Req() req: Request, @Param() param): Promise<IResponse<Event>>  {
  //   return await this.service.delete(req,param.id);
  // }


}
