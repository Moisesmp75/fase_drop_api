import { CreateUserCommand } from "../../../domain/model/commands/user/create-user.command";
import { User } from "../../../domain/model/entites/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { TsUserRepository } from "../../../infrastructure/storage-account/repositories/ts-user.repository";
import { HashingService } from "../../internal/outbound-services/hashing.service";

export class CreateUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly hashingService: HashingService;

  constructor(userRepository: UserRepository = null) {
    if (!userRepository) {
      this.userRepository = new TsUserRepository(process.env["StorageAccountName"], process.env["StorageAccountKey"]);
    } else {
      this.userRepository = userRepository;
    }
    this.hashingService = new HashingService();
  }

  async execute(command: CreateUserCommand): Promise<User> {
    
    const user = new User(
      command.first_name,
      command.last_name,
      command.email,
      command.password,
      command.born_date,
      command.roles,
      command.is_active
    );
    
    const existingUser = await this.userRepository.findByEmail(user.getEmail());
    if (existingUser) {
      throw new Error("Ya existe un usuario con este email");
    }

    const hashedPassword = await this.hashingService.hashPassword(command.password);

    user.setPassword(hashedPassword);

    return await this.userRepository.create(user);
  }
}