import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Coupoun1769504826081 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Coupoun",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "coupoun_name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "discount_offered",
            type: "varchar",
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Coupoun");
  }
}
