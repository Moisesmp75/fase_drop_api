interface PredictionRequest {
  edad: number;
  grado: number;
  conducta: number;
  asistencia: number;
  matematicas: number;
  comunicacion: number;
  ciencias_sociales: number;
  cta: number;
  ingles: number;
}

interface PredictionResponse {
  prediction: boolean;
}

export class PredictionService {
  private readonly apiUrl = 'https://fn-trainml-beta.azurewebsites.net/api/prediction';

  async getPrediction(request: PredictionRequest): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Error al obtener la predicción');
      }

      const data: PredictionResponse = await response.json();
      return data.prediction;
    } catch (error) {
      console.error('Error en el servicio de predicción:', error);
      return false; // En caso de error, retornamos false como valor por defecto
    }
  }
} 