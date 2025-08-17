import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user-orm.entity';

export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): User {
    return new User(
      ormEntity.id,
      ormEntity.username,
      ormEntity.email,
      ormEntity.password,
      ormEntity.isActive,
      ormEntity.roles,
      ormEntity.lastLogin,
      ormEntity.profilePicture,
      ormEntity.isEmailVerified,
      ormEntity.emailVerificationToken ?? undefined,
      ormEntity.emailVerificationTokenExpires ?? undefined,
      ormEntity.refreshToken,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: User): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.username = domainEntity.username;
    ormEntity.email = domainEntity.email;
    ormEntity.password = domainEntity.password;
    ormEntity.isActive = domainEntity.isActive;
    ormEntity.roles = domainEntity.roles;
    ormEntity.lastLogin = domainEntity.lastLogin ?? new Date();
    ormEntity.profilePicture = domainEntity.profilePicture ?? '';
    ormEntity.isEmailVerified = domainEntity.isEmailVerified;
    ormEntity.emailVerificationToken = domainEntity.emailVerificationToken ?? null;
    ormEntity.emailVerificationTokenExpires = domainEntity.emailVerificationTokenExpires ?? null;
    ormEntity.refreshToken = domainEntity.refreshToken ?? '';
    ormEntity.createdAt = domainEntity.createdAt ?? new Date();
    ormEntity.updatedAt = domainEntity.updatedAt ?? new Date();
    return ormEntity;
  }
}