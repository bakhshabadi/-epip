import { IResponse } from '@lib/epip-crud';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let token=req.headers['authorization'];
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        (req as any).currentUser=jwt.decode(token, process.env.JWT_SECRET);
        next();
    } catch(err) {
        res.statusCode=401;
        res.send({
            status:401,
            message: 'شما مجوز استفاده از این api را ندارید.'
        } as IResponse<any>)
    }
    
  }
}