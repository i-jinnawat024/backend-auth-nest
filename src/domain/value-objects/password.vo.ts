export class Password {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Password must be at least 8 characters long and contain at least one letter and one number');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private isValid(password: string): boolean {
    if (password.length < 8) {
      return false;
    }
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasLetter && hasNumber;
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }
}