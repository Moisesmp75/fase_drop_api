import { Edad } from "../value-objects/edad";
import { Grado } from "../value-objects/grado";
import { Seccion } from "../value-objects/seccion";
import { Periodo } from "../value-objects/periodo";
import { TipoPeriodo } from "../enums/periodo.enum";

export class Alumno {
  private readonly id: string;
  private readonly nombre: string;
  private readonly apellido: string;
  private readonly edad: Edad;
  private readonly grado: Grado;
  private readonly seccion: Seccion;
  private readonly distrito: string;
  private readonly idUsuarioResponsable: string;
  private readonly periodo: Periodo;

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    grado: number,
    seccion: string,
    distrito: string,
    id: string = null,
    idUsuarioResponsable: string,
    tipoPeriodo: TipoPeriodo,
    valorPeriodo: number,
    anio: number
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = new Edad(edad);
    this.grado = new Grado(grado);
    this.seccion = new Seccion(seccion);
    this.distrito = distrito;
    this.idUsuarioResponsable = idUsuarioResponsable;
    this.periodo = new Periodo(tipoPeriodo, valorPeriodo, anio);
  }

  public getId(): string { return this.id; }
  public getNombre(): string { return this.nombre; }
  public getApellido(): string { return this.apellido; }
  public getEdad(): number { return this.edad.get(); }
  public getGrado(): number { return this.grado.get(); }
  public getSeccion(): string { return this.seccion.get(); }
  public getDistrito(): string { return this.distrito; }
  public getIdUsuarioResponsable(): string { return this.idUsuarioResponsable; }
  public getTipoPeriodo(): TipoPeriodo { return this.periodo.getTipo(); }
  public getValorPeriodo(): number { return this.periodo.getValor(); }
  public getAnio(): number { return this.periodo.getAnio(); }
} 