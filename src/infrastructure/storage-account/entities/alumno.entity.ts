import { BaseEntity } from "./base.entity";
import { NotaEntity } from "./nota.entity";

export interface AlumnoEntity extends BaseEntity {
  id: string;
  idUsuarioResponsable: string;
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  distrito: string;
  notas?: NotaEntity[];
} 