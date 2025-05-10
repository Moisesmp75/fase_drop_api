import { SignInCommand } from "../../../domain/model/commands/user/sign-in.command";
import { User } from "../../../domain/model/entites/user.entity";
import { Email } from "../../../domain/model/value-objects/email";
import { Password } from "../../../domain/model/value-objects/password";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { TsUserRepository } from "../../../infrastructure/storage-account/repositories/ts-user.repository";
import { HashingService } from "../../internal/outbound-services/hashing.service";
import { JwtTokenService } from "../../internal/outbound-services/jwt-token.service";

export class SignInUseCase {
  private readonly userRepository: UserRepository;
  private readonly hashingService: HashingService;
  private readonly tokenService: JwtTokenService;

  constructor(userRepository: UserRepository = null) {
    if (!userRepository) {
      this.userRepository = new TsUserRepository(process.env["StorageAccountName"], process.env["StorageAccountKey"]);
    } else {
      this.userRepository = userRepository;
    }
    this.hashingService = new HashingService();
    this.tokenService = new JwtTokenService();
  }

  async execute(command: SignInCommand): Promise<{ user: User; token: string }> {
    const validateEmail = Email.isValid(command.email);
    const validatePasswordLength = Password.validatePasswordLength(command.password);
    const validatePasswordContent = Password.validatePasswordContent(command.password);

    if (!validateEmail || !validatePasswordLength || !validatePasswordContent) {
      throw new Error("Email o contraseña inválidos");
    }
    
    const user = await this.userRepository.findByEmail(command.email);
    
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isValidPassword = await this.hashingService.comparePasswords(
      command.password,
      user.getPassword()
    );

    if (!isValidPassword) {
      throw new Error("Contraseña incorrecta");
    }

    const token = this.tokenService.generateToken(
      user.getId(),
      user.getEmail(),
      user.getRoles().map(role => role.get())
    );

    return {
      user,
      token
    };
  }
}
