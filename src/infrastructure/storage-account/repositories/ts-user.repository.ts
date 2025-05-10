import { UserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/model/entites/user.entity";
import { AzureTableClient } from "./base.repository";
import { UserEntity } from "../entities/user.entity";
import { v4 as uuidv4 } from 'uuid';

export class TsUserRepository implements UserRepository {
  private readonly tableName;
  private readonly tableClient: AzureTableClient;

  constructor(accountName: string, accountKey: string) {
    this.tableName = 'users';
    this.tableClient = new AzureTableClient(accountName, accountKey, this.tableName);
  }

  async init(): Promise<void> {
    await this.tableClient.ensureTableExists();
  }

  async create(user: User): Promise<User> {
    const userEntity: UserEntity = {
      partitionKey: user.Email().domain,
      rowKey: user.Email().email,
      userId: uuidv4(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
      password: user.getPassword(),
      bornDate: '' + user.getBornDate().toISOString().split('T')[0],
      roles: user.getRoles().map(role => role.get()).join(","),
      isActive: user.getIsActive()
    }

    await this.tableClient.insert(userEntity);

    return new User(
      userEntity.firstName,
      userEntity.lastName,
      userEntity.email,
      null,
      userEntity.bornDate,
      userEntity.roles.split(",").map(role => parseInt(role)),
      userEntity.isActive,
      userEntity.userId
    );
  }

  findById(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const [rowKey, partitionKey] = email.split("@");
      const userEntity = await this.tableClient.getById<UserEntity>(partitionKey, rowKey);
      if (!userEntity) {
        return null;
      }
      
      const user = new User(
        userEntity.firstName,
        userEntity.lastName,
        userEntity.email,
        null,
        userEntity.bornDate,
        userEntity.roles.split(",").map(role => parseInt(role)),
        userEntity.isActive,
        userEntity.userId
      );
      user.setPasswordHash(userEntity.password);
      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error("Ocurrió un error al buscar el usuario en la base de datos.");
    }
  }

  update(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
