import { Edad } from "../value-objects/edad";
import { Grado } from "../value-objects/grado";
import { Seccion } from "../value-objects/seccion";
import { Nota } from "../value-objects/nota";

export class Alumno {
  private readonly id: string;
  private readonly nombre: string;
  private readonly apellido: string;
  private readonly edad: Edad;
  private readonly grado: Grado;
  private readonly seccion: Seccion;
  private readonly conducta: Nota;
  private readonly distrito: string;
  private readonly asistencia: Nota;
  private readonly matematicas: Nota;
  private readonly comunicacion: Nota;
  private readonly ciencias_sociales: Nota;
  private readonly cta: Nota;
  private readonly ingles: Nota;
  private readonly prediccion: number;
  private readonly idUsuarioResponsable: string;

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    grado: number,
    seccion: string,
    conducta: number,
    distrito: string,
    asistencia: number,
    matematicas: number,
    comunicacion: number,
    ciencias_sociales: number,
    cta: number,
    ingles: number,
    id: string = null,
    prediccion: number = null,
    idUsuarioResponsable: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = new Edad(edad);
    this.grado = new Grado(grado);
    this.seccion = new Seccion(seccion);
    this.conducta = new Nota(conducta);
    this.distrito = distrito;
    this.asistencia = new Nota(asistencia);
    this.matematicas = new Nota(matematicas);
    this.comunicacion = new Nota(comunicacion);
    this.ciencias_sociales = new Nota(ciencias_sociales);
    this.cta = new Nota(cta);
    this.ingles = new Nota(ingles);
    this.prediccion = prediccion;
    this.idUsuarioResponsable = idUsuarioResponsable;
  }

  public getId(): string { return this.id; }
  public getNombre(): string { return this.nombre; }
  public getApellido(): string { return this.apellido; }
  public getEdad(): number { return this.edad.get(); }
  public getGrado(): number { return this.grado.get(); }
  public getSeccion(): string { return this.seccion.get(); }
  public getConducta(): number { return this.conducta.get(); }
  public getDistrito(): string { return this.distrito; }
  public getAsistencia(): number { return this.asistencia.get(); }
  public getMatematicas(): number { return this.matematicas.get(); }
  public getComunicacion(): number { return this.comunicacion.get(); }
  public getCienciasSociales(): number { return this.ciencias_sociales.get(); }
  public getCta(): number { return this.cta.get(); }
  public getIngles(): number { return this.ingles.get(); }
  public getPrediccion(): number { return this.prediccion; }
  public getIdUsuarioResponsable(): string { return this.idUsuarioResponsable; }
} 