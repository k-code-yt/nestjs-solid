import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('text', { unique: true, nullable: false })
  email: string;

  @Column('text', { unique: false, nullable: false })
  firstName: string;

  @Column('text', { unique: false, nullable: false })
  password: string;

  @Column('timestamp', { unique: false, nullable: false })
  lastLoginAt: Date;
}
