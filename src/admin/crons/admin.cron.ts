import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import to from 'await-to-js';
import { CustomerService } from '../services/customer.service';

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
  constructor( private service: CustomerService){}
  @WebSocketServer() 
  server;

  messages = [];  

  private readonly logger = new Logger(AdminTasksService.name);

  @Cron('* * * * * *')
  public async handleCronTrackingCustomer() {
    let [err, data] = await this.service.trackingCustomer();
    if(err){
      return this.logger.error(err.message);
    }
    
    this.server.emit('tracking', data);
  }

  @Cron('* * * * * *')
  public async handleCron() {
    await this.service.autoJob();
  }
}