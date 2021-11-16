import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, IsNull } from 'typeorm';

export class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number=0;

  @ApiProperty()
  @Column({nullable:true})
  insertedAt?: Date=new Date();

  @ApiProperty()
  @Column({nullable:true})
  updatedAt?: Date=new Date();

  @Column({nullable:true})
  deletedAt?: Date=null;
}