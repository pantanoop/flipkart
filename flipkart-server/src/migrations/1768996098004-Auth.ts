import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Auth1768996098004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "userid",
            type: "bigint",
            isUnique: true,
          },
          {
            name: "useremail",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "userpassword",
            type: "varchar",
          },
          {
            name: "username",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "role",
            type: "varchar",
            default: "customer",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true, // 'true' ensures it checks if table exists before creating
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
