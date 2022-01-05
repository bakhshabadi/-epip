import { BaseEntity } from "@lib/epip-crud";
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Event extends BaseEntity{
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  subject: string;

  @ApiProperty()
  @Column({ length: 500 })
  details: string;

  @ApiProperty()
  @Column({ default: null})
  event_time: Date;

  @ApiProperty()
  @Column({ default: null, length: 10})
  is_done: string;

  @ApiProperty()
  @Column({ default: false})
  is_auto_service: boolean;

  @ApiProperty()
  @Column({ type:'bigint' })
  user_id:number;
}

export class IAddEvent{
  @ApiProperty()
  moderator_id: number;

  @ApiProperty()
  customer_id: number;

  @ApiProperty()
  event: Event;
} 