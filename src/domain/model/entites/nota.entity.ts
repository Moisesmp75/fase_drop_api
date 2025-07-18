import { NotaAcademica } from "../value-objects/nota-academica";
import { Periodo } from "../value-objects/periodo";
import { TipoPeriodo } from "../enums/periodo.enum";
import { Grado } from "../value-objects/grado";
import { Seccion } from "../value-objects/seccion";

export class Nota {
  private readonly id: string;
  private readonly alumnoId: string;
  private readonly grado: Grado;
  private readonly seccion: Seccion;
  private readonly periodo: Periodo;
  private readonly matematicas: NotaAcademica;
  private readonly comunicacion: NotaAcademica;
  private readonly ciencias_sociales: NotaAcademica;
  private readonly cta: NotaAcademica;
  private readonly ingles: NotaAcademica;
  private readonly asistencia: NotaAcademica;
  private readonly conducta: NotaAcademica;
  private readonly prediccion: boolean;
  private readonly comentario: string;
  private readonly fechaPrediccion: Date;

  constructor(
    alumnoId: string,
    grado: number,
    seccion: string,
    tipoPeriodo: TipoPeriodo,
    valorPeriodo: number,
    anio: number,
    matematicas: number,
    comunicacion: number,
    ciencias_sociales: number,
    cta: number,
    ingles: number,
    asistencia: number,
    conducta: number,
    prediccion: boolean = false,
    comentario: string = '',
    id: string = null,
    fechaPrediccion: Date = null
  ) {
    this.id = id;
    this.alumnoId = alumnoId;
    this.grado = new Grado(grado);
    this.seccion = new Seccion(seccion);
    this.periodo = new Periodo(tipoPeriodo, valorPeriodo, anio);
    this.matematicas = new NotaAcademica(matematicas);
    this.comunicacion = new NotaAcademica(comunicacion);
    this.ciencias_sociales = new NotaAcademica(ciencias_sociales);
    this.cta = new NotaAcademica(cta);
    this.ingles = new NotaAcademica(ingles);
    this.asistencia = new NotaAcademica(asistencia);
    this.conducta = new NotaAcademica(conducta);
    this.prediccion = prediccion;
    this.comentario = comentario;
    this.fechaPrediccion = fechaPrediccion || new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
  }

  public getId(): string { return this.id; }
  public getAlumnoId(): string { return this.alumnoId; }
  public getGrado(): number { return this.grado.get(); }
  public getSeccion(): string { return this.seccion.get(); }
  public getTipoPeriodo(): TipoPeriodo { return this.periodo.getTipo(); }
  public getValorPeriodo(): number { return this.periodo.getValor(); }
  public getAnio(): number { return this.periodo.getAnio(); }
  public getMatematicas(): number { return this.matematicas.get(); }
  public getComunicacion(): number { return this.comunicacion.get(); }
  public getCienciasSociales(): number { return this.ciencias_sociales.get(); }
  public getCta(): number { return this.cta.get(); }
  public getIngles(): number { return this.ingles.get(); }
  public getAsistencia(): number { return this.asistencia.get(); }
  public getConducta(): number { return this.conducta.get(); }
  public getPrediccion(): boolean { return this.prediccion; }
  public getComentario(): string { return this.comentario; }
  public getFechaPrediccion(): Date { return this.fechaPrediccion; }
} 