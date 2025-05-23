import { Edad } from "../value-objects/edad";

export class Alumno {
  private readonly id: string;
  private readonly nombre: string;
  private readonly apellido: string;
  private readonly dni: string;
  private readonly edad: Edad;
  private readonly distrito: string;
  private readonly idUsuarioResponsable: string;

  constructor(
    nombre: string,
    apellido: string,
    dni: string,
    edad: number,
    distrito: string,
    idUsuarioResponsable: string,
    id: string = null
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.edad = new Edad(edad);
    this.distrito = distrito;
    this.idUsuarioResponsable = idUsuarioResponsable;
  }

  public getId(): string { return this.id; }
  public getNombre(): string { return this.nombre; }
  public getApellido(): string { return this.apellido; }
  public getDni(): string { return this.dni; }
  public getEdad(): number { return this.edad.get(); }
  public getDistrito(): string { return this.distrito; }
  public getIdUsuarioResponsable(): string { return this.idUsuarioResponsable; }
} 