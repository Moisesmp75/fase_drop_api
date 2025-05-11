import { NotaAcademica } from "../value-objects/nota-academica";
import { Periodo } from "../value-objects/periodo";
import { TipoPeriodo } from "../enums/periodo.enum";

export class Nota {
  private readonly id: string;
  private readonly alumnoId: string;
  private readonly periodo: Periodo;
  private readonly matematicas: NotaAcademica;
  private readonly comunicacion: NotaAcademica;
  private readonly ciencias_sociales: NotaAcademica;
  private readonly cta: NotaAcademica;
  private readonly ingles: NotaAcademica;
  private readonly asistencia: NotaAcademica;
  private readonly conducta: NotaAcademica;
  private readonly prediccion: number;

  constructor(
    alumnoId: string,
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
    prediccion: number = null,
    id: string = null
  ) {
    this.id = id;
    this.alumnoId = alumnoId;
    this.periodo = new Periodo(tipoPeriodo, valorPeriodo, anio);
    this.matematicas = new NotaAcademica(matematicas);
    this.comunicacion = new NotaAcademica(comunicacion);
    this.ciencias_sociales = new NotaAcademica(ciencias_sociales);
    this.cta = new NotaAcademica(cta);
    this.ingles = new NotaAcademica(ingles);
    this.asistencia = new NotaAcademica(asistencia);
    this.conducta = new NotaAcademica(conducta);
    this.prediccion = prediccion;
  }

  public getId(): string { return this.id; }
  public getAlumnoId(): string { return this.alumnoId; }
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
  public getPrediccion(): number { return this.prediccion; }
} 