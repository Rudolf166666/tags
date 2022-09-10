import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1662803740453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nickname',
            isNullable: false,
            type: 'varchar',
            isUnique: true,
            length: '30',
          },
          {
            name: 'email',
            isNullable: false,
            type: 'varchar',
            isUnique: true,
            length: '100',
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
            length: '100',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
