import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { College } from "./college.entity";

@Entity()
export class CollegeWiseCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => College)
  college: College;

  @Column()
  course_name: string;

  @Column()
  course_duration: number;

  @Column()
  course_fee: number;
}
