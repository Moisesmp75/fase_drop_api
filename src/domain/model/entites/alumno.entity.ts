import { Edad } from "../value-objects/edad";
import { Nota } from "./nota.entity";

export class Alumno {
  private readonly id: string;
  private readonly nombre: string;
  private readonly apellido: string;
  private readonly dni: string;
  private readonly edad: Edad;
  private readonly distrito: string;
  private readonly idUsuarioResponsable: string;
  private notas: Nota[];
  private ultimoGrado: number;
  private ultimaSeccion: string;
  private ultimaPrediccion: boolean;

  constructor(
    nombre: string,
    apellido: string,
    dni: string,
    edad: number,
    distrito: string,
    idUsuarioResponsable: string,
    id: string = null,
    notas: Nota[] = []
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.edad = new Edad(edad);
    this.distrito = distrito;
    this.idUsuarioResponsable = idUsuarioResponsable;
    this.notas = notas;
    this.ultimoGrado = null;
    this.ultimaSeccion = null;
    this.ultimaPrediccion = null;
  }

  public getId(): string { return this.id; }
  public getNombre(): string { return this.nombre; }
  public getApellido(): string { return this.apellido; }
  public getDni(): string { return this.dni; }
  public getEdad(): number { return this.edad.get(); }
  public getDistrito(): string { return this.distrito; }
  public getIdUsuarioResponsable(): string { return this.idUsuarioResponsable; }
  public getNotas(): Nota[] { return this.notas; }
  public getUltimoGrado(): number { return this.ultimoGrado; }
  public getUltimaSeccion(): string { return this.ultimaSeccion; }
  public getUltimaPrediccion(): boolean { return this.ultimaPrediccion; }

  public setUltimoGrado(grado: number): void { this.ultimoGrado = grado; }
  public setUltimaSeccion(seccion: string): void { this.ultimaSeccion = seccion; }
  public setUltimaPrediccion(prediccion: boolean): void { this.ultimaPrediccion = prediccion; }
  public setNotas(notas: Nota[]): void { this.notas = notas; }
} 