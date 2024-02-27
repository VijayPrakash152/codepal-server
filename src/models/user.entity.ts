// Import necessary modules from TypeORM
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// Define the enum for the 'gender' column
enum Gender {
  Male = 'M',
  Female = 'F',
  Other = 'O',
}

// Define the User entity
@Entity({ schema: 'codepal', name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 50,nullable: true })
  userName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ default: false,nullable: true })
  isVerified: boolean;

  @Column({ default: false,nullable: true })
  isMentor: boolean;
}
