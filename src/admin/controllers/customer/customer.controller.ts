import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@lib/epip-crud";
import { Body, Get, Param, Req } from "@nestjs/common";
import { Request } from "express";
import { Customer } from "src/admin/models/crm/customer.model";
import { CustomerService } from "src/admin/services/customer.service";
// import { PersonService } from "src/admin/services/person.service";

@ApiController(Customer)
export class CustomerController {
  constructor(
    private readonly crmService: CustomerService,
    // private readonly mozService: PersonService
  ) {
  }

  @ApiGetAll(Customer)
  public async getAll(@Req() req: Request): Promise<IResponseAll<Customer>>  {
    let data= await this.crmService.getAll(req);
    return data;
  }

  @ApiGet(Customer,':id')
  public async get(@Req() req: Request, @Param() param): Promise<IResponse<Customer>>  {
    return await this.crmService.get(req,param.id);
  }

  @ApiPost(Customer)
  public async post(@Req() req: Request, @Body() entity:Customer): Promise<IResponse<Customer>>  {
    return await this.crmService.post(req,entity);
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
