import { ApiProperty } from "@nestjs/swagger";

export class IResponse<T>{
    
    @ApiProperty()
    status:number=0;

    @ApiProperty()
    message?:string;
    

    results?:Array<T>;
}