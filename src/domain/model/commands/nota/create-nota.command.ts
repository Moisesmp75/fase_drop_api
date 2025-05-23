import { TipoPeriodo } from "../../enums/periodo.enum";

export interface CreateNotaCommand {
  alumnoId: string;
  grado: number;
  seccion: string;
  tipoPeriodo: TipoPeriodo;
  valorPeriodo: number;
  anio: number;
  matematicas: number;
  comunicacion: number;
  ciencias_sociales: number;
  cta: number;
  ingles: number;
  asistencia: number;
  conducta: number;
  prediccion?: number;
} 