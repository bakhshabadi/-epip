import { Injectable } from '@nestjs/common';
import { Customer } from '../models/crm/customer.model';
import { Event } from '../models/crm';
import * as Kavenegar from "kavenegar";
import { TemplateType } from '../enums/kavenegar.type';

@Injectable()
export class KavenegarService{

  private sendOtp(phone,temp,token:Array<string>){
    let api = Kavenegar.KavenegarApi({
      apikey: process.env.KAVENEGAR_API_KEY,
    })
    api.VerifyLookup({
      'receptor': phone,
      'template': temp,
      'token': token[0],
      'token2': token[1],
      'token3': token[2],
      'type': 'sms',
    },
      function(response, status,err) {
        console.log(response);
        console.log(status);
        console.log(err);
      }
    );
  }

  public sendRuleSms(event:Event, customer: Customer){
    switch (event.subject) {
      case "value1":
        this.sendOtp(customer.phone,TemplateType.Welcome,[customer.name]);
        break;
      case "value2":
        this.sendOtp(customer.phone,TemplateType.Welcome,[customer.name]);
        break;
      case "value3":
        this.sendOtp(customer.phone,TemplateType.Welcome,[customer.name]);
        break;
    }
  }
  
}
