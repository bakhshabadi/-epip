import { IResponse } from "@lib/epip-crud";
import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { DivarService } from "src/admin/services/divar.service";

@Controller('divar')
export class DivarController {
  constructor(
    private readonly repo: DivarService
  ) { }

  @Get("/:cityId")
  public async get(@Req() req:Request, @Param() param:any): Promise<IResponse<any>>{
    return this.repo.get(param.cityId);
  }

  @Post("login/:phone")
  public async login(@Req() req: Request, @Param() params): Promise<IResponse<any>> {
    return this.repo.login(params.phone);
  }

  @Post("otp/:phone/:code")
  public async otp(@Req() req: Request, @Param() params,@Body() body:any): Promise<IResponse<any>> {
    return this.repo.otp(req, params.phone,params.code);
  }

  @Post("post/:phone/:id/:token")
  public async post(@Req() req: Request, @Param() params, @Body() body:any): Promise<IResponse<any>> {
    return this.repo.sendToDivar(req,params.phone, params.id, params.token);
  }
}
