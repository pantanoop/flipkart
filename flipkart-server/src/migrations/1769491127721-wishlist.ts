/* eslint-disable */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class wishlist1769491127721 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "wishlist",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "productid",
            type: "bigint",
          },
          {
            name: "userid",
            type: "bigint",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("wishlist");
  }
}
