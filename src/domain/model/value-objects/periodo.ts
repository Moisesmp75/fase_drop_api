import { TipoPeriodo } from '../enums/periodo.enum';

export class Periodo {
  private readonly tipo: TipoPeriodo;
  private readonly valor: number;
  private readonly anio: number;

  constructor(tipo: TipoPeriodo, valor: number, anio: number) {
    this.validateValor(tipo, valor);
    this.validateAnio(anio);
    
    this.tipo = tipo;
    this.valor = valor;
    this.anio = anio;
  }

  private validateValor(tipo: TipoPeriodo, valor: number): void {
    if (tipo === TipoPeriodo.BIMESTRE && (valor < 1 || valor > 4)) {
      throw new Error('El valor del bimestre debe estar entre 1 y 4');
    }
    if (tipo === TipoPeriodo.TRIMESTRE && (valor < 1 || valor > 3)) {
      throw new Error('El valor del trimestre debe estar entre 1 y 3');
    }
  }

  private validateAnio(anio: number): void {
    const currentYear = new Date().getFullYear();
    if (anio < 2000 || anio > currentYear + 1) {
      throw new Error(`El año debe estar entre 2000 y ${currentYear + 1}`);
    }
  }

  public getTipo(): TipoPeriodo {
    return this.tipo;
  }

  public getValor(): number {
    return this.valor;
  }

  public getAnio(): number {
    return this.anio;
  }
} 