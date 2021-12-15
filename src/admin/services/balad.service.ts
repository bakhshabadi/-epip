import { IResponse, IResponseAll } from '@lib/epip-crud';
import { Injectable } from '@nestjs/common';
import to from 'await-to-js';
import * as Axios from "axios"
import * as encodeurl from "encodeurl";

@Injectable()
export class BaladService{
  public async getGeoLoc(address: string):Promise<IResponseAll<any>>{    
    const [err,data] = await to(Axios.default.get(process.env.BALAD_API+encodeurl(address)));
    if(err){
      return {
        count:0,
        status:500,
        message:err.message,
        results:[]
      }
    }

    return {
      count:data.data.results.length,
      status:200,
      message:"دریافت داده ها",      
      results:data.data.results
    }
  } 
}