
export class FullName {
  private readonly first_name: string;
  private readonly last_name: string;

  constructor(first_name: string, last_name: string) {

    if (!FullName.validateFullName(first_name, last_name))
      throw new Error("El nombre o apellido no deben ser vacios")
    this.first_name = first_name.trim();
    this.last_name = last_name.trim();
  }

  public static validateFullName(first_name: string, last_name: string): boolean {
    if (first_name == null || last_name == null)
      return false;
    if (first_name.length == 0 || last_name.length == 0)
      return false;
    return true;
  }

  get FirstName(): string {
    return this.first_name;
  }

  get LastName(): string {
    return this.last_name;
  }

  get (): string {
    return `${this.first_name} ${this.last_name}`
  }
}