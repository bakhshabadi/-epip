import { Controller, Delete, Get, Param, Req, Res } from "@nestjs/common";
import { Request } from "express";
import { BaladService } from "src/admin/services/balad.service";

@Controller('Balad')
export class BaladController {
    constructor(
        private readonly repo: BaladService,
    ) { }

    @Get(':addr')
    public async get(@Req() req: Request, @Param() params) {
        return this.repo.getGeoLoc(params.addr);
    }
}