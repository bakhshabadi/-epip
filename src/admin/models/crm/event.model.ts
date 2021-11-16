import { BaseEntity } from "@lib/epip-crud";
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Customer } from "./customer.model";

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
  @Column({ default: false})
  is_done: boolean;
}

export class IAddEvent{
  @ApiProperty()
  moderator_id: number;

  @ApiProperty()
  customer_id: number;

  @ApiProperty()
  event: Event;
} 