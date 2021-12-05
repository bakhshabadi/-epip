import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@lib/epip-crud";
import { Body, Get, Param, Req } from "@nestjs/common";
import to from "await-to-js";
import { Request } from "express";
import { Customer } from "src/admin/models/crm/customer.model";
import { CustomerService } from "src/admin/services/customer.service";
import { PersonService } from "src/admin/services/person.service";
// import { PersonService } from "src/admin/services/person.service";

@ApiController(Customer)
export class CustomerController {
  constructor(
    private readonly crmService: CustomerService,
    private readonly mozService: PersonService
  ) {
  }

  @ApiGetAll(Customer)
  public async getAll(@Req() req: Request): Promise<IResponseAll<Customer>>  {
    let data:IResponseAll<Customer>=null;
    let query:any= req.query;
    if(query.moderator_name__isnull){
      data = await this.crmService.getAll(req);
    }else{
      if(query.neighborhood_id){
        data = await this.crmService.getCustomers(req,query.moderator_id,query.district_id);
      }else{
        data = await this.crmService.getAll(req);
      }
    }
    
    return data;
  }

  @ApiGet(Customer,':id')
  public async get(@Req() req: Request, @Param() param): Promise<IResponse<Customer>>  {
    return await this.crmService.get(req,param.id);
  }

  @ApiPost(Customer)
  public async post(@Req() req: Request, @Body() entity:Customer): Promise<IResponse<any>>  {
    //IResponse<Customer>
    let [err,data] =await to(this.mozService.addPerson(entity));
    console.log("********************")
    if(err){
      return {
        status: 501,
        message: (err as any)
      } as IResponse<string>;
    }else{
      entity.moz_id=data;
      entity.deleted_at=null;
      let ret = await this.crmService.post(req,entity);
      if(ret.status==201){
        return {
          status: 200,
          message: 'اطلاعات به درستی ثبت گردید',
          result:{
            mozUserId:data,
            crmUser:ret.result
          }
        } as IResponse<any>;
      }

      return {
        status: 500,
        message: 'مشتری در سامانه crm ثبت نشد.'
      } as IResponse<string>;
      
    }
    
  }

  @ApiPost(Customer,":mozId")
  public async moveToCrm(@Req() req: Request, @Param() param) : Promise<IResponse<Customer>>{

    return await this.mozService.moveToCrm(param.mozId);
  }

  @ApiPut(Customer,':id')
  public async put(@Req() req: Request, @Param() param,@Body() entity:Customer): Promise<IResponse<Customer>>  {
    return await this.crmService.put(req,param.id,entity);
  }

  @ApiPatch(Customer,':id')
  public async patch(@Req() req: Request, @Param() param,@Body() entity:Customer): Promise<IResponse<Customer>>  {
    return await this.crmService.patch(req,param.id,entity);
  }

  @ApiDelete(Customer,':id')
  public async delete(@Req() req: Request, @Param() param): Promise<IResponse<Customer>>  {
    return await this.crmService.delete(req,param.id);
  }
}
