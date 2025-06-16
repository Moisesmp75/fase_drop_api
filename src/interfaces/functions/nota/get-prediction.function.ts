import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { GetPredictionUseCase } from "../../../application/use-cases/nota/get-prediction.use-case";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";
import { GetPredictionCommand } from "../../../domain/model/commands/nota/get-prediction.command";

export const GetPredictionFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: {
          message: "Token de autorización requerido"
        }
      };
    }

    const token = authHeader.split(' ')[1];
    const tokenService = new JwtTokenService();
    const decodedToken = tokenService.validateToken(token);

    if (!decodedToken) {
      return {
        status: 401,
        jsonBody: {
          message: "Token inválido o expirado"
        }
      };
    }

    const body = await request.json() as GetPredictionCommand;
    
    const requiredFields = [
      'edad',
      'grado',
      'conducta',
      'asistencia',
      'matematicas',
      'comunicacion',
      'ciencias_sociales',
      'cta',
      'ingles'
    ];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return {
        status: 400,
        jsonBody: {
          message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        }
      };
    }

    const getPredictionUseCase = new GetPredictionUseCase();
    const prediction = await getPredictionUseCase.execute(new GetPredictionCommand(
      body.edad,
      body.grado,
      body.conducta,
      body.asistencia,
      body.matematicas,
      body.comunicacion,
      body.ciencias_sociales,
      body.cta,
      body.ingles
    ));

    return {
      status: 200,
      jsonBody: {
        prediction
      }
    };
  } catch (error) {
    return {
      status: 400,
      jsonBody: {
        message: error.message
      }
    };
  }
} 