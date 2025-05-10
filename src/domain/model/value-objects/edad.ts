
export class Edad {
  private readonly value: number;

  constructor(edad: number) {
    if (!Edad.validateEdad(edad))
      throw new Error(`La edad ${edad} no es válida.`);
    this.value = edad;
  }

  public static validateEdad(edad: number): boolean {
    if (edad == null)
      return false;
    if (edad < 5 || edad > 20)
      return false;
    return true;
  }

  public get(): number {
    return this.value;
  }
} 