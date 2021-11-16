import { BaseEntity } from "@lib/epip-crud";
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class Person{
  seller_id: number;
  phone: number;
  name: string;
  count: number;
}

