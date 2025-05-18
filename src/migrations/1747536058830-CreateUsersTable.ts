import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'isActive',
            type: 'bit', 
            default: 1,  
          },
          {
            name: 'roles',
            type: 'varchar', 
            length: '255',
            default: "'user'", 
          },
          {
            name: 'lastLogin',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'profilePicture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isEmailVerified',
            type: 'bit',
            default: 0,
          },
          {
            name: 'emailVerificationToken',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'emailVerificationTokenExpires',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'refreshToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime2',
            default: 'GETDATE()', 
          },
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'GETDATE()', 
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
