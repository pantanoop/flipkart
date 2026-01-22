// import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders } from "typeorm-extension";
// import UserSeeder from "./src/databases/seeds/user.seeder";
// import UserFactory from "./src/databases/factories/user.factory";
import { AppDataSource } from "./data-source";

(async () => {
  await AppDataSource.initialize();

  await runSeeders(AppDataSource);
})();
