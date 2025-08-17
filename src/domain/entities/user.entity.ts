export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly isActive: boolean = true,
    public readonly roles: string[] = ['user'],
    public readonly lastLogin?: Date,
    public readonly profilePicture?: string,
    public readonly isEmailVerified: boolean = false,
    public readonly emailVerificationToken?: string,
    public readonly emailVerificationTokenExpires?: Date,
    public readonly refreshToken?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    username: string;
    email: string;
    password: string;
    roles?: string[];
  }): User {
    return new User(
      0, // Will be set by repository
      props.username,
      props.email,
      props.password,
      true,
      props.roles || ['user'],
      undefined,
      undefined,
      false,
      undefined,
      undefined,
      undefined,
      new Date(),
      new Date(),
    );
  }

  updatePassword(newPassword: string): User {
    return new User(
      this.id,
      this.username,
      this.email,
      newPassword,
      this.isActive,
      this.roles,
      this.lastLogin,
      this.profilePicture,
      this.isEmailVerified,
      this.emailVerificationToken,
      this.emailVerificationTokenExpires,
      this.refreshToken,
      this.createdAt,
      new Date(),
    );
  }

  updateRefreshToken(refreshToken?: string): User {
    return new User(
      this.id,
      this.username,
      this.email,
      this.password,
      this.isActive,
      this.roles,
      this.lastLogin,
      this.profilePicture,
      this.isEmailVerified,
      this.emailVerificationToken,
      this.emailVerificationTokenExpires,
      refreshToken,
      this.createdAt,
      new Date(),
    );
  }

  verifyEmail(): User {
    return new User(
      this.id,
      this.username,
      this.email,
      this.password,
      this.isActive,
      this.roles,
      this.lastLogin,
      this.profilePicture,
      true,
      undefined,
      undefined,
      this.refreshToken,
      this.createdAt,
      new Date(),
    );
  }

  setEmailVerificationToken(token: string, expiresAt: Date): User {
    return new User(
      this.id,
      this.username,
      this.email,
      this.password,
      this.isActive,
      this.roles,
      this.lastLogin,
      this.profilePicture,
      this.isEmailVerified,
      token,
      expiresAt,
      this.refreshToken,
      this.createdAt,
      new Date(),
    );
  }

  deactivate(): User {
    return new User(
      this.id,
      this.username,
      this.email,
      this.password,
      false,
      this.roles,
      this.lastLogin,
      this.profilePicture,
      this.isEmailVerified,
      this.emailVerificationToken,
      this.emailVerificationTokenExpires,
      this.refreshToken,
      this.createdAt,
      new Date(),
    );
  }
}