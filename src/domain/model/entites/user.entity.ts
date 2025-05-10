import { FullName } from "../value-objects/full-name";
import { Email } from "../value-objects/email";
import { Password } from "../value-objects/password";
import { BornDate } from "../value-objects/born-date";
import { Role } from "../value-objects/role";

export class User {

  private id: string;
  private fullName: FullName;
  private email: Email;
  private password: Password;
  private bornDate: BornDate;
  private roles: Role[];
  private isActive: boolean;

  constructor(
    first_name: string, last_name: string,
    email: string, password: string, bornDate: string,
    roles: number[], is_active: boolean, id: string = null
  ) {
    this.id = id;
    this.fullName = new FullName(first_name, last_name);
    this.email = new Email(email);
    this.password = password ? new Password(password) : null;
    this.bornDate = new BornDate(bornDate);
    this.roles = roles.map(role => new Role(role));
    this.isActive = is_active;
  }
  public static create(
    first_name: string, last_name: string, email: string,
    borndDate: string, roles: number[], is_active: boolean,
    id: string
  ): User {
    return new User(first_name, last_name, email, null, borndDate, roles, is_active, id);
  }

  public getId(): string { return this.id; }
  public getFirstName(): string { return this.fullName.FirstName; }
  public getLastName(): string { return this.fullName.LastName; }
  public getEmail(): string { return this.email.get(); }
  public Email(): Email { return this.email; }
  public getIsActive(): boolean { return this.isActive; }
  public setPassword(password: string): void { this.password.setPassword(password); }
  public getPassword(): string { return this.password.get(); }
  public setPasswordHash(passwordHash: string): void {
    this.password = new Password("Contra1234#");
    this.password.setPassword(passwordHash);
  }
  public getBornDate(): Date { return this.bornDate.get(); }
  public getAge(): number { return this.bornDate.getAge(); }
  public getRoles(): Role[] { return this.roles; }
}
