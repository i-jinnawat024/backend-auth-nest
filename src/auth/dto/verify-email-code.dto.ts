import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailCodeDto {
  @IsEmail({}, { message: 'กรุณาใส่อีเมลที่ถูกต้อง' })
  email: string;

  @IsString({ message: 'รหัสยืนยันต้องเป็นตัวอักษร' })
  @Length(6, 6, { message: 'รหัสยืนยันต้องมี 6 หลัก' })
  code: string;
}