import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Product1769063177104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
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
            isUnique: true,
          },
          {
            name: "productname",
            type: "varchar",
          },
          {
            name: "price",
            type: "float",
          },
          {
            name: "category",
            type: "varchar",
          },
          {
            name: "subcategory",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "photoUrl",
            type: "varchar",
          },
          {
            name: "rating",
            type: "float",
          },
          {
            name: "sellerid",
            type: "bigint",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
