import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-array', { default: 'user' })
  roles: string[];

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: 'datetime', nullable: true })
  emailVerificationTokenExpires: Date | null;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
