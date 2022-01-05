import { BaseEntity } from "@lib/epip-crud";
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class Person{
  id: number;
  seller_id: number;
  phone: number;
  name: string;
  count: number;
}


export class IUser{
  id: number;
  deleted_at: Date;
  inserted_at: Date;
  updated_at: Date;
  name: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  active: boolean;
  expire: Date;
  domain_id: string;
  parent_id: number;
  max_session: number;
  max_view_property: number;
  moderator_id: number;
  moderator_name: string;
}
