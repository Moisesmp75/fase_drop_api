export interface GetAlumnosQuery {
  readonly grado?: number;
  readonly seccion?: string;
  readonly distrito?: string;
  readonly idUsuarioResponsable: string;
} 