import { BaseEntity } from "./base.entity";

export interface AlumnoEntity extends BaseEntity {
  id: string;
  idUsuarioResponsable: string;
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  distrito: string;
} 