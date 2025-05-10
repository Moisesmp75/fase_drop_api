export class Grado {
  private readonly value: number;

  constructor(grado: number) {
    if (!Grado.validateGrado(grado))
      throw new Error(`El grado ${grado} no es válido.`);
    this.value = grado;
  }

  public static validateGrado(grado: number): boolean {
    if (grado == null)
      return false;
    if (grado < 1 || grado > 6)
      return false;
    return true;
  }

  public get(): number {
    return this.value;
  }
} 