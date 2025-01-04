import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { City } from "./city.entity";
import { State } from "./state.entity";

@Entity()
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  score: number;

  @ManyToOne(() => City)
  city: City;

  @ManyToOne(() => State)
  state: State;
}
