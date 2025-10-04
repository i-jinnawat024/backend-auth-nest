export class EmailVerificationCode {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly code: string,
    public readonly expiresAt: Date,
    public readonly isUsed: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: { email: string; code: string; expiresAt: Date }): EmailVerificationCode {
    return new EmailVerificationCode(
      0,
      props.email,
      props.code,
      props.expiresAt,
      false,
      new Date(),
      new Date(),
    );
  }

  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static createWithGeneratedCode(email: string, expirationMinutes: number = 10): EmailVerificationCode {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    return this.create({ email, code, expiresAt });
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isUsed && !this.isExpired();
  }

  markAsUsed(): EmailVerificationCode {
    return new EmailVerificationCode(
      this.id,
      this.email,
      this.code,
      this.expiresAt,
      true,
      this.createdAt,
      new Date(),
    );
  }

  verify(inputCode: string): boolean {
    return this.code === inputCode && this.isValid();
  }
}