import { IResponse, IResponseAll } from "@lib/epip-crud";
import { Controller, Delete, Get, Param, Req } from "@nestjs/common";
import to from "await-to-js";
import { Request } from "express";
// import { Customer } from "src/admin/models/crm/customer.model";
// import { CustomerService } from "src/admin/services/customer.service";
import { PersonService } from "src/admin/services/person.service";

@Controller('People')
export class PersonController {
  constructor(
    private readonly mozService: PersonService,
    // private readonly crmService: CustomerService
  ) {
  }

  @Get('/')
  public async getUsers(@Req() req: Request): Promise<any>  {
    return this.mozService.getUsers(req);
  }

  @Delete('DeleteFreeOrders/:userId')
  public async deleteFreeOrders(@Req() req: Request, @Param() params): Promise<IResponseAll<any>>  {
    const [err,data]= await to(this.mozService.deleteFreeOrders(params.userId));
    if(err){
      return {
        status:500,
        count:0,
        results : [],
        message:err.message
      } as IResponseAll<any>
    }

    return {
      status:200,
      count:1,
      results : data      
    } as IResponseAll<any>
  }

  // @Get()
  // public async fetch(@Req() req: Request, @Param() param): Promise<number>  {
  //   let people = await this.mozService.fetchPerson();
  //   let num=0;
  //   for (let i = 0; i < people.length; i++) {
  //     const element = new Customer()
  //     element.name=people[i].name || " ";
  //     element.seller_id=people[i].seller_id;
  //     element.agency='';
  //     element.address='';
  //     element.phone=people[i].phone;
  //     element.count_ads=people[i].count;
  //     element.moz_id=people[i].id;
      
  //     let res= await this.crmService.post(null,element);
  //     if(res.status==201){
  //       console.clear()
  //       console.log(num,'/',people.length)
  //       num++;
  //     }
  //   }
  //   return people.length;
  // }
}
