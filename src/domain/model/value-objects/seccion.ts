
export class Seccion {
  private readonly value: string;

  constructor(seccion: string) {
    if (!Seccion.validateSeccion(seccion))
      throw new Error(`La sección ${seccion} no es válida.`);
    this.value = seccion;
  }

  public static validateSeccion(seccion: string): boolean {
    if (seccion == null)
      return false;
    if (!['A', 'B', 'C', 'D'].includes(seccion.toUpperCase()))
      return false;
    return true;
  }

  public get(): string {
    return this.value;
  }
} 