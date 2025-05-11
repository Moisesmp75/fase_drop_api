import { TipoPeriodo } from "../../enums/periodo.enum";

export interface CreateAlumnoCommand {
  nombre: string;
  apellido: string;
  edad: number;
  grado: number;
  seccion: string;
  distrito: string;
  idUsuarioResponsable: string;
  tipoPeriodo: TipoPeriodo;
  valorPeriodo: number;
  anio: number;
}