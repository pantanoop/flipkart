import { setSeederFactory } from "typeorm-extension";
import { User } from "../../auth/entities/users.entity";

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.userid = faker.date.past().getTime();
  user.username = faker.person.firstName();
  user.useremail = faker.internet.email();
  user.userpassword = "123456";
  user.role = "admin";
  user.createdAt = faker.date.past();
  user.updatedAt = faker.date.past();

  return user;
});
