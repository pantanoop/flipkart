import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Coupoun } from "../../coupouns/entities/coupoun.entity";

export default class CoupounSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Coupoun);
    await repository.insert([
      {
        coupoun_name: "anoop10",
        discount_offered: "10%",
      },
      {
        coupoun_name: "anoop30",
        discount_offered: "30%",
      },
      {
        coupoun_name: "anoop50",
        discount_offered: "50%",
      },
    ]);

    // const userFactory = factoryManager.get(User);
    // await userFactory.saveMany(5);
  }
}
