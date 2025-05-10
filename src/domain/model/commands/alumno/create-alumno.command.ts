export interface CreateAlumnoCommand {
  nombre: string;
  apellido: string;
  edad: number;
  grado: number;
  seccion: string;
  conducta: number;
  distrito: string;
  asistencia?: number;
  matematicas?: number;
  comunicacion?: number;
  ciencias_sociales?: number;
  cta?: number;
  ingles?: number;
  idUsuarioResponsable: string;
  prediccion?: number;
}