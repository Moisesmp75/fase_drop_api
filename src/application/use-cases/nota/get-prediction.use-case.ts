import { GetPredictionCommand } from "../../../domain/model/commands/nota/get-prediction.command";
import { PredictionService } from "../../internal/outbound-services/prediction.service";

export class GetPredictionUseCase {
  private readonly predictionService: PredictionService;

  constructor(predictionService: PredictionService = null) {
    this.predictionService = predictionService || new PredictionService();
  }

  async execute(command: GetPredictionCommand): Promise<boolean> {
    try {
      return await this.predictionService.getPrediction({
        edad: command.edad,
        grado: command.grado,
        conducta: command.conducta,
        asistencia: command.asistencia,
        matematicas: command.matematicas,
        comunicacion: command.comunicacion,
        ciencias_sociales: command.ciencias_sociales,
        cta: command.cta,
        ingles: command.ingles
      });
    } catch (error) {
      throw new Error(`Error al obtener la predicción: ${error.message}`);
    }
  }
} 