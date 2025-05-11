import { BaseEntity } from "./base.entity";
import { TipoPeriodo } from "../../../domain/model/enums/periodo.enum";

export interface AlumnoEntity extends BaseEntity {
  id: string;
  idUsuarioResponsable: string;
  nombre: string;
  apellido: string;
  edad: number;
  grado: number;
  seccion: string;
  distrito: string;
  tipoPeriodo: TipoPeriodo;
  valorPeriodo: number;
  anio: number;
} 