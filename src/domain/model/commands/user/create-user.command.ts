
export interface CreateUserCommand {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly password: string;
  readonly born_date: string;
  readonly roles: number[];
  readonly is_active: boolean;
}
