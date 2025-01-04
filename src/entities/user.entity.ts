import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Index('email_UNIQUE', { unique: true })
  @Column('varchar', { length: 255, nullable: false })
  email: string;
}
