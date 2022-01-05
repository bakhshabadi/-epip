import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import to from 'await-to-js';
// import { Customer } from '../models/crm';
// import { CustomerService } from '../services/customer.service';
import { PersonService } from '../services/person.service';

@Injectable()
@WebSocketGateway(8085,{
  cors:{
    allowedHeaders:'*',
    methods:'*',
    origin: '*',
    credentials:true
  }
})
export class AdminTasksService {
  constructor( 
    // private service: CustomerService,
    private mozService: PersonService,
  ){}
  @WebSocketServer() 
  server;

  messages = [];  

  private readonly logger = new Logger(AdminTasksService.name);

  // @Cron("0 * * * * *")
  // public async handleCronTrackingCustomer() {
  //   let [err, data] = await this.service.trackingCustomer();
  //   if(err){
  //     return this.logger.error(err.message);
  //   }
    
  //   this.server.emit('tracking', data);
  // }

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // public async handleCron() {
  //   await this.service.autoJob();
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // public async getchUsers(){
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
      
  //     let res= await this.service.post(null,element);
  //     if(res.status==201){
  //       console.clear()
  //       console.log(num,'/',people.length)
  //       num++;
  //     }
  //   }
  // }
}