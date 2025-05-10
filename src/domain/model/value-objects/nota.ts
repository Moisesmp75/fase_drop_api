
export class Nota {
  private readonly value: number;

  constructor(nota: number) {
    if (!Nota.validateNota(nota))
      throw new Error(`La nota ${nota} no es válida.`);
    this.value = nota;
  }

  public static validateNota(nota: number): boolean {
    if (nota == null)
      return false;
    if (nota < 0 || nota > 20)
      return false;
    return true;
  }

  public get(): number {
    return this.value;
  }
} 