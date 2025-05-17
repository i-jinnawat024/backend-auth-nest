// auth/dto/logout.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
