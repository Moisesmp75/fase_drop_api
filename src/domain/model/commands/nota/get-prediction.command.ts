export class GetPredictionCommand {
  constructor(
    public readonly edad: number,
    public readonly grado: number,
    public readonly conducta: number,
    public readonly asistencia: number,
    public readonly matematicas: number,
    public readonly comunicacion: number,
    public readonly ciencias_sociales: number,
    public readonly cta: number,
    public readonly ingles: number
  ) {}
} 