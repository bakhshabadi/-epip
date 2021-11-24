import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, IsNull } from 'typeorm';

export class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number=0;

  @ApiProperty()
  @Column({nullable:true})
  inserted_at?: Date=new Date();

  @ApiProperty()
  @Column({nullable:true})
  updated_at?: Date=new Date();

  @Column({nullable:true})
  deleted_at?: Date=null;
}