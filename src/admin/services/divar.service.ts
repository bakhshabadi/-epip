import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
// import { Customer } from '../models/crm/customer.model';
import to from 'await-to-js';
import { IResponse, IResponseAll } from '@lib/epip-crud';
import * as Axios from "axios"
import { Request } from "express";
import { ConfigModule } from '@nestjs/config';


@Injectable()
export class DivarService {
  constructor(
    @Inject('MOZ_REPOSITORY')
    private repo: Repository<any>,
  ) { }

  public async get(cityId: number): Promise<IResponseAll<any>> {
    let dic={
      2:"3",
      1:"1"
    }
    const [err, data] = await to(Axios.default.get(process.env.DIVAR_API_GET_DISTRICTS.replace("%s",dic[cityId])));
    if (err) {
      return {
        status: 500,
        message: process.env.DIVAR_API_GET_DISTRICTS.replace("%s",dic[cityId])
      } as IResponseAll<any>
    } 

    return {
      status: 200,
      results:data.data,
    } as IResponseAll<any>
  }

  public async login(phone: number): Promise<IResponse<any>> {
    const [err, data] = await to(Axios.default.post(process.env.DIVAR_API_AUTH, {
      "phone": phone
    }));
    if (err) {
      return {
        status: 500,
        message: err.message
      }
    }

    return {
      status: 200,
      message: "پیامک ارسال گردید",
    }
  }

  public async otp(req: Request, phone: number, code: number): Promise<IResponse<any>> {
    const [err, data] = await to(Axios.default.post(process.env.DIVAR_API_CONFIRM, {
      "phone": phone,
      "code": code
    }));
    if (err) {
      return {
        status: 500,
        message: err.message
      }
    }

    return {
      status: 200,
      message: "ورود با موفقیت ثبت گردید",
      result: data.data
    }
  }


  public async sendToDivar(req:Request,phone: string, propertyId: string, token: string) : Promise<IResponse<any> | any> {
    const [err3, _] = await to(Axios.default.post(process.env.SCRAPPER_API,{
      token,
      "city_id": 2,
      "username": "0"+phone,
      "person_name": 'crm > '+(req as any).currentUser.name,
      "districts": [],
      "user_agent":req.headers["user_agent"],
      "limit": 50,
    }))
    
    if (err3) {
      console.log(err3.message)
      return {
        status: 500,
        message: err3.message
      }
    }
    if(req.query.neighId && req.query.divarId){
      let [err, _] = await to(
        this.repo.query(
          `update bon_neighborhood set divar_id=$1 where product_ptr_id=$2`,[
            req.query.divarId,
            req.query.neighId
          ]
        )
      );
      if(err){
        return {
          status: 501,
          message: err3.message
        }
      }
    }

    let [err, res] = await to(this.repo.query(`
      select 
        (
          select bd.city_id from bon_neighborhood bn
          inner join bon_district bd on bd.id = bn.district_id
          where bn.product_ptr_id=bp.neighborhood_id
        ) as city_id,
        (
          select bn.divar_id from bon_neighborhood bn
          where bn.product_ptr_id=bp.neighborhood_id
        ) as divar_id,
        (
          select count(*) from bon_property_amenities where property_id=bp.id and amenity_id=2
        ) as is_parking,
        (
          select count(*) from bon_property_amenities where property_id=bp.id and amenity_id=1
        ) as is_elevator,
        (
          select count(*) from bon_property_amenities where property_id=bp.id and amenity_id=5
        ) as is_balcony,
        bp.*
      from bon_property bp
      where bp.id=$1
    `, [propertyId]));

    if (err) {
      return new Promise((_, rej) => {
        rej("خطا در  ارتباط با سرور")
      })
    }

    let getCategory=(row)=>{
      let dic = [
        {
          statusId: [0],
          typeId: [0],
          value: "apartment-sell",
        },
        {
          statusId: [1, 2],
          typeId: [0],
          value: "apartment-rent",
        },
        {
          statusId: [0],
          typeId: [6],
          value: "office-sell",
        },
        {
          statusId: [1, 2],
          typeId: [6],
          value: "office-rent",
        },
        {
          statusId: [0],
          typeId: [1],
          value: "house-villa-sell",
        },
        {
          statusId: [1, 2],
          typeId: [1],
          value: "house-villa-rent",
        },
        {
          statusId: [0],
          typeId: [4],
          value: "shop-sell",
        },
        {
          statusId: [1, 2],
          typeId: [4],
          value: "shop-rent",
        },
        {
          statusId: [5],
          typeId: [0, 1, 2, 3, 4, 5, 6, 7],
          value: "partnership",
        },
        {
          statusId: [0],
          typeId: [4],
          value: "industry-agriculture-business-sell",
        },
        {
          statusId: [1, 2],
          typeId: [4],
          value: "industry-agriculture-business-rent",
        },
        {
          statusId: [3],
          typeId: [0, 1, 2, 3, 4, 5, 6, 7],
          value: "presell",
        },
        {
          statusId: [1, 2],
          typeId: [5],
          value: "suite-apartment",
        },
        {
          statusId: [0, 1, 2],
          typeId: [1, 7],
          value: "villa",
        },
      ]

      let obj = dic.find(d => d.statusId.includes(res[0]['status_id']) && d.typeId.includes(res[0]['type_id']));
      return obj ? obj.value : "";
    }

    let post = {
      "post": {
        "contact": { "chat_enabled": false, "phone": "0" + phone },
        "location": {
          "radius": 300,
          "destination_latitude": res[0].latitude,
          "destination_longitude": res[0].longitude,
          "neighborhood": res[0].divar_id,
          "city": (() => {
            let dic = {
              1: 1,
              2: 3
            }
            return dic[res[0].city_id] || 3
          })()
        },
        // "other_options_and_attributes": {
        //   "other_attributes_section": {},
        //   "other_options_section": {}
        // },

        "category": getCategory(res[0]),
        "images": [],
        "size": 10,

        "user_type": "مشاور املاک",
        ...((row)=>{
          if([1,2,6].includes(row.status_id)){
            return {
              "new_credit": +row.deposit,
              "new_rent": +row.price, 
              "rent_credit_transform": `${res[0].changeable?true:false}`,
              "rent_to_single": "false",
            }
          }else{
            return {
              "new_price": +row.price,
            }
          }
        })(res[0]),
        
        "rooms": ((row) => {
          switch (row.rooms) {
            case 0:
              return "بدون اتاق"
            case 1:
              return "یک"              
            case 2:
              return "دو"              
            case 3:
              return "سه"              
            case 4:
              return "چهار"              
            case 5:
              return "پنج یا بیشتر"              
            default:
              return "پنج یا بیشتر"
          }
        })(res[0]),
        "year": ((num) => {
          return Intl.NumberFormat('fa').format(num).replace(/\٬/g, '')
        })(res[0].built_year),
        ...(()=>{
          if(["house-villa-rent","house-villa-sell"].includes(getCategory(res[0]))){
            return {
              "balcony":`${res[0].changeable?true:false}`,
            }
          }else{
            return {
              "floor": `${res[0].floor || 0}`,
              "elevator": `${res[0].is_elevator?true:false}`,
            }
          }
        })(),        
        "parking": `${res[0].is_parking?true:false}`,
        "warehouse": `${res[0].store || false}`,
        "title": res[0].address.substring(0,20),
        "description": res[0].title+" "+res[0].address +" "+res[0].description
      }
    }

    
    const [err1, data] = await to(Axios.default.post(process.env.DIVAR_API_POST,post, {
      headers:{
        "authorization": "Basic " + token
      }
    }));
    if (err1) {
      // console.log()
      return post;
      return {
        status: 502,
        message: err1.message,
      } as IResponse<any>
    }
    return {
      status: 200,
      message: "ارسال با موفقیت ثبت گردید",
      //result: data
    }
  }


}