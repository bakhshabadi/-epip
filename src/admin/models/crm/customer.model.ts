import { BaseEntity } from "@lib/epip-crud";
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Event } from "./event.model";
import { Competitor } from "./file.model";
import { Post } from "./post.model";

@Entity()
export class Customer extends BaseEntity{
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({type:'bigint',default:null})
  moz_id: number;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({type:'bigint',unique:true})
  phone: number;

  @ApiProperty()
  @Column({ length: 100, nullable:true })
  agency: string;

  @ApiProperty()
  @Column({ length: 500, nullable:true })
  address: string;

  // @ApiProperty()
  // @ManyToMany(() => Post)
  // @JoinTable()
  // Posts: Array<Post>;

  @ManyToOne(() => Post, post => post.customers)
  post: Post;

  
  @ApiProperty()
  @Column({ default: null,type:'bigint'})
  seller_id: number

  @ApiProperty()
  @Column({ default: null,type:'bigint'})
  count_ads: number

  @ApiProperty()
  @Column({ default: null,type:'bigint'})
  moderator_id: number

  @ApiProperty()
  @Column({ default: null, length: 100})
  moderator_name: string

  @ApiProperty()
  @Column({ default: null, length: 100})
  status: string

  @ApiProperty()
  @Column({ default: '', length: 1000})
  competitor: string

  @ApiProperty()
  @ManyToMany(() => Event)
  @JoinTable()
  events: Array<Event>;

  // @ApiProperty()
  // @ManyToMany(() => Competitor)
  // @JoinTable()
  // competitor: Array<Competitor>;

  @ApiProperty()
  @Column({ default: false,nullable:true})
  is_video_record: boolean;

  @ApiProperty()
  @Column({default: null, type: 'int',nullable:true})
  filing_rate: number;

  @ApiProperty()
  @Column({default: null, type: 'int',nullable:true})
  support_rate: number;
  
  @ApiProperty()
  @Column({default: '',nullable:true})
  advantages: string;

  @ApiProperty()
  @Column({default: '',nullable:true})
  disadvantages: string;
  

}

