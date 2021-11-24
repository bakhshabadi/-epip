import { ApiProperty } from "@nestjs/swagger";

export class IResponseAll<T>{
    @ApiProperty()
    count:number=0;

    @ApiProperty()
    status:number=0;

    @ApiProperty()
    message?:string;

    results:Array<T>;
}

export class IResponse<T>{
    
    @ApiProperty()
    status:number=0;

    @ApiProperty()
    message?:string;
    
    result?:T;
}