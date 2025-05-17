import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  isString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters' })
  @MaxLength(20, { message: 'Username must be at most 20 characters' })
  username: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  isActive: boolean;

  @IsOptional()
  roles: string[];

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password must be at most 32 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character (!@#$%^&*)',
  })
  password: string;

  @IsOptional()
  @IsString()
  confirmPassword?: string;

  @IsOptional()
  lastLogin: Date;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsString()
  refreshToken
}
