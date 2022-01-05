import { BaseEntity } from "@lib/epip-crud";
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
// import { Customer } from "./customer.model";

@Entity()
export class Competitor extends BaseEntity{
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;
}

