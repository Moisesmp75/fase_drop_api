import { BaseEntity } from "./base.entity";

export interface AlumnoEntity extends BaseEntity {
  id: string;
  idUsuarioResponsable: string;
  nombre: string;
  apellido: string;
  edad: number;
  grado: number;
  seccion: string;
  conducta: number;
  distrito: string;
  asistencia: number;
  matematicas: number;
  comunicacion: number;
  ciencias_sociales: number;
  cta: number;
  ingles: number;
  prediccion: number;
} 