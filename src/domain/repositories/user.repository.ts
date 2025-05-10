import { User } from "../model/entites/user.entity";

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
