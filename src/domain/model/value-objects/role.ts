import { RolesEnum } from "../enums/roles.enum";

export class Role {
  private readonly role: RolesEnum;

  constructor(role: number) {
    if (!Role.validateRole(role))
      throw new Error(`El rol ${role} no es válido.`);
    this.role = role;
  }

  public static validateRole(role: number): boolean {
    if (role == null)
      return false;
    return ValidateRoles.IsValidRole(role);
  }

  public get(): RolesEnum {
    return this.role;
  }
}

export class ValidateRoles {

  public static IsValidRole(role: number): boolean {
    const numericValues = Object.values(RolesEnum).filter(value => typeof value === 'number');
    return numericValues.includes(role);
  }

  public static IncludeRole(roles: string[], roleEnum: RolesEnum): boolean {
    
    const roleValue = roleEnum;
    const userRolesValues = roles.map(role => RolesEnum[role as keyof typeof RolesEnum]);

    return userRolesValues.includes(roleValue);
  }

  public static IncludeRoles(roles: string[], rolesEnum: RolesEnum[]): boolean {

    const userRolesValues = roles.map(role => RolesEnum[role as keyof typeof RolesEnum]);

    return rolesEnum.some(roleEnum => userRolesValues.includes(roleEnum));
  }

}