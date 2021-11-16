import { Controller, Get, Param, Req } from "@nestjs/common";
import { Request } from "express";
import { Customer } from "src/admin/models/crm/customer.model";
import { Person } from "src/admin/models/moz/model.model";
import { CustomerService } from "src/admin/services/customer.service";
import { PersonService } from "src/admin/services/person.service";

@Controller('People')
export class PersonController {
  constructor(
    private readonly mozService: PersonService,
    private readonly crmService: CustomerService
  ) {
  }

  @Get()
  public async fetch(@Req() req: Request, @Param() param): Promise<number>  {
    let people = await this.mozService.fetchPerson();
    let num=0;
    for (let i = 0; i < people.length; i++) {
      const element = new Customer()
      element.name=people[i].name;
      element.seller_id=people[i].seller_id;
      element.agency='';
      element.address='';
      element.phone=people[i].phone;
      element.count_ads=people[i].count;
      
      let res= await this.crmService.post(null,element);
      if(res.status==201){
        console.clear()
        console.log(num,'/',people.length)
        num++;
      }
    }
    return people.length;
  }

}
