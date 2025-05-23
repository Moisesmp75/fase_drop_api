import { TipoPeriodo } from "../../enums/periodo.enum";

export interface CreateAlumnoCommand {
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  distrito: string;
  idUsuarioResponsable: string;
}