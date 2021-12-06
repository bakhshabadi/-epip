import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Customer } from '../models/crm/customer.model';
import { Person } from '../models/moz/model.model';
import to from 'await-to-js';
import { IResponse } from '@lib/epip-crud';
import * as Axios from "axios"

@Injectable()
export class DivarService{
  constructor(
    @Inject('MOZ_REPOSITORY')
    private repo:Repository<any>,
  ){ }

  public async login(phone:number): Promise<IResponse<any>>{
    const [err,data] = await to(Axios.default.post(process.env.DIVAR_API_AUTH,{
      "phone": phone
    }));
    if(err){
      return {
        status:500,
        message:err.message
      }
    }

    return {
      status:200,
      message:"پیامک ارسال گردید",      
    }
  }

  public async otp(phone:number, code:number): Promise<IResponse<any>>{
    const [err,data] = await to(Axios.default.post(process.env.DIVAR_API_CONFIRM,{
      "phone":phone,
      "code":code
    }));
    if(err){
      return {
        status:500,
        message:err.message
      }
    }
    console.log(data);
    return {
      status:200,
      message:"ورود با موفقیت ثبت گردید",   
      result:data.data
    }
  }


  public async sendToDivar(req: Request, propertyId: number,phone: number){
    let [err,res]= await to(this.repo.query(`
      select
        (
          select bd.city_id from bon_neighborhood bn
          inner join bon_district bd on bd.id = bn.district_id
          where bn.product_ptr_id=bp.neighborhood_id
        ) as city_id,
        (
          select count(*) from bon_property_amenities where property_id=bp.id and amenity_id=2
        ) as is_parking,
        (
          select city_id from bon_neighborhood where property_id=bp.id and amenity_id=2
        ) as is_parking,
        bp.*
      from bon_property bp
      where bp.id=$1
    `,[propertyId]));

    if(err){
      return new Promise((_,rej)=>{
        rej("خطا در ارتباط با سرور")
      })
    }

    
    let post={
      "post":{
        "contact":{"chat_enabled":false,"phone":"0"+phone},
        "location":{
          "radius":300,
          "destination_latitude":res[0].latitude,
          "destination_longitude":res[0].longitude,

          "city":(()=>{
            let dic={
              1:1,
              2:3
            }
            return dic[res[0].city_id]
          })()
        },
        "other_options_and_attributes":{
          "other_attributes_section":{},
          "other_options_section":{}
        },

        "category":(()=>{
            let dic = [
              {
                statusId:[0],
                typeId:[0],
                value:"apartment-sell",
              },
              {
                statusId:[1,2],
                typeId:[0],
                value:"apartment-rent",
              },
              {
                statusId:[0],
                typeId:[6],
                value:"office-sell",
              },
              {
                statusId:[1,2],
                typeId:[6],
                value:"office-rent",
              },
              {
                statusId:[0],
                typeId:[1],
                value:"house-villa-sell",
              },
              {
                statusId:[1,2],
                typeId:[1],
                value:"house-villa-rent",
              },
              {
                statusId:[0],
                typeId:[4],
                value:"shop-sell",
              },
              {
                statusId:[1,2],
                typeId:[4],
                value:"shop-rent",
              },
              {
                statusId:[1,2],
                typeId:[4],
                value:"partnership",
              },
              
                // "partnership",
                // "plot-old",
                // "industry-agriculture-business-sell",
                // "industry-agriculture-business-rent",
                // "presell",
                // "suite-apartment",
                // "villa",
                // "workspace"

            ]
          })(),
          "images":[],
          "size":10,

          // "مشاور املاک"
          // "شخصی"
          "user_type":"شخصی",
          "new_credit":1235,
          "new_rent":100,
          "new_price":10000000,
          "rent_credit_transform":"false",
          "rent_to_single":"false",

          // "بدون اتاق"
          // "یک"
          // "دو"
          // "سه"
          // "چهار"
          // "پنج یا بیشتر"
          "rooms":"یک",
          "year":((num)=>{
            return Intl.NumberFormat('fa').format(num).replace(/\٬/,'')
          })(1399),
          "floor":"1",
          "elevator":"true",
          "parking":"true",
          "warehouse":"true",
          "title":"الکی",
          "description":"الکی روم زوم میکنی \nگوم گوم میکنه قلبم\n"
        }
      }


  }

 
}