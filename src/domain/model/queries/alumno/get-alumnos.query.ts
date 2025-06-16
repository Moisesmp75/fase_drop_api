export class GetAlumnosQuery {
  constructor(
    public readonly idUsuarioResponsable: string,
    public readonly distrito?: string,
    public readonly grado?: number,
    public readonly seccion?: string
  ) {}
} 