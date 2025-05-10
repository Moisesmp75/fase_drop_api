import { BaseEntity } from "./base.entity";

export interface UserEntity extends BaseEntity {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly bornDate: string;
  readonly roles: string;
  readonly isActive: boolean;
  readonly userId: string;
}
