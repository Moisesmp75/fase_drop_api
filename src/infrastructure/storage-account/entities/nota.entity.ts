import { BaseEntity } from "./base.entity";
import { TipoPeriodo } from "../../../domain/model/enums/periodo.enum";

export interface NotaEntity extends BaseEntity {
  id: string;
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
  prediccion: number;
} 