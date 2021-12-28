import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@lib/epip-crud";
import { Body, Controller, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { DivarService } from "src/admin/services/divar.service";

@Controller('divar')
export class DivarController {
  constructor(
    private readonly repo: DivarService
  ) { }

  @Post("login/:phone")
  public async login(@Req() req: Request, @Param() params): Promise<IResponse<any>>  {
    return this.repo.login(params.phone);
  }

  @Post("otp/:phone/:code")
  public async otp(@Req() req: Request, @Param() params,@Body() body:any): Promise<IResponse<any>>  {
    return this.repo.otp(params.phone,params.code);
  }

  @Post("post/:phone/:id/:token")
  public async post(@Req() req: Request, @Param() params, @Body() body:any): Promise<IResponse<any>>  {
    console.log(body);
    return this.repo.sendToDivar(params.phone, params.id, params.token);
  }
}
