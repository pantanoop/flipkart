/* eslint-disable */
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateOrdersTables1769407897877 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    
    await queryRunner.createTable(
      new Table({
        name: "orders",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "orderid",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "userid",
            type: "bigint",
          },
          {
            name: "totalAmount",
            type: "float",
          },
          {
            name: "status",
            type: "enum",
            enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: `'ORDERED'`,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true,
    );

    
    await queryRunner.createTable(
      new Table({
        name: "order_items",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "orderid",
            type: "bigint",
          },
          {
            name: "productid",
            type: "bigint",
          },
          {
            name: "sellerid",
            type: "bigint",
          },
          {
            name: "quantity",
            type: "int",
          },
          {
            name: "priceAtPurchase",
            type: "float",
          },
        ],
      }),
      true,
    );

    
    await queryRunner.createForeignKey(
      "order_items",
      new TableForeignKey({
        columnNames: ["orderid"],
        referencedTableName: "orders",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("order_items");
    await queryRunner.dropTable("orders");
  }
}