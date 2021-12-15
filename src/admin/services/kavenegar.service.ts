import { Injectable } from '@nestjs/common';
import { Customer } from '../models/crm/customer.model';
import { Event } from '../models/crm';
import * as Kavenegar from "kavenegar";
import { TemplateType } from '../enums/kavenegar.type';

@Injectable()
export class KavenegarService{

  public sendOtp(phone,temp,token:Array<string>){
    let api = Kavenegar.KavenegarApi({
      apikey: process.env.KAVENEGAR_API_KEY,
    });
    let data = {
      'receptor': phone,
      'template': temp.trim(),
      'token': token[0].trim().replace(/ /g,'_'),
      'token2': (token[1] && token[1].trim().replace(/ /g,'_')),
      'token3': (token[2] && token[2].trim().replace(/ /g,'_')),
      'type': 'sms',
    };
    api.VerifyLookup(data,
      function(response, status,err) {
        console.log(response);
        console.log(status);
        console.log(err);
      }
    );
  }
  
}
