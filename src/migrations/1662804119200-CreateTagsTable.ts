import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTagsTable1662804119200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            isNullable: false,
            type: 'varchar',
            isUnique: true,
            length: '40',
          },
          {
            name: 'sort_order',
            isNullable: false,
            type: 'int',
            default: 0,
          },
          { name: 'creator_id', type: 'uuid' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'tags',
      new TableForeignKey({
        name: 'tags_creator_id_fk',
        columnNames: ['creator_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tags');
  }
}
