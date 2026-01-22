import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { User } from "../../auth/entities/users.entity";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        userid: 1769073284080,
        useremail: "john@gmail.com",
        userpassword: "123456",
        username: "john",
        role: "admin",
        createdAt: "2020-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ]);

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(5);
  }
}


