import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@lib/epip-crud";
import { Body, Param, Req, Post, Patch } from "@nestjs/common";
import { Request } from "express";
import * as Model from "src/admin/models/crm";
import { EventService } from "src/admin/services/event.service";

@ApiController(Model.Event)
export class EventController {
  constructor(private readonly service: EventService) {
  }

  @Post()
  public async addEvent(@Req() req: Request, @Body() entity:Model.IAddEvent): Promise<IResponse<Model.Event>>{
    return await this.service.addEvent(req, entity);
  }

  @Patch(":modaratorId/:customerId/:eventId")
  public async doneEvent(@Req() req: Request, @Param() param): Promise<IResponse<boolean>>{
    return await this.service.doneEvent(req, param.modaratorId,param.customerId,param.eventId);
  }

  // @ApiGetAll(Event)
  // public async getAll(@Req() req: Request): Promise<IResponseAll<Event>>  {
  //   return await this.service.getAll(req);
  // }

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
