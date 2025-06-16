import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CreateNotaUseCase } from "../../../application/use-cases/nota/create-nota.use-case";
import { CreateNotaCommand } from "../../../domain/model/commands/nota/create-nota.command";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";
import { TipoPeriodo } from "../../../domain/model/enums/periodo.enum";

export const CreateNotaFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

    const body = await request.json() as CreateNotaCommand;
    
    const requiredFields = [
      'alumnoId',
      'tipoPeriodo',
      'valorPeriodo',
      'anio',
      'matematicas',
      'comunicacion',
      'ciencias_sociales',
      'cta',
      'ingles',
      'asistencia',
      'conducta'
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

    // Validar que tipoPeriodo sea un valor válido del enum
    if (!Object.values(TipoPeriodo).includes(body.tipoPeriodo)) {
      return {
        status: 400,
        jsonBody: {
          message: `El tipo de período debe ser ${Object.values(TipoPeriodo).join(' o ')}`
        }
      };
    }

    const createNotaUseCase = new CreateNotaUseCase();
    const nota = await createNotaUseCase.execute(body);

    return {
      status: 201,
      jsonBody: {
        message: "Nota registrada exitosamente",
        nota: {
          id: nota.getId(),
          alumnoId: nota.getAlumnoId(),
          tipoPeriodo: nota.getTipoPeriodo(),
          valorPeriodo: nota.getValorPeriodo(),
          anio: nota.getAnio(),
          matematicas: nota.getMatematicas(),
          comunicacion: nota.getComunicacion(),
          ciencias_sociales: nota.getCienciasSociales(),
          cta: nota.getCta(),
          ingles: nota.getIngles(),
          asistencia: nota.getAsistencia(),
          conducta: nota.getConducta(),
          prediccion: nota.getPrediccion(),
          comentario: nota.getComentario(),
          fechaPrediccion: nota.getFechaPrediccion().toISOString()
        }
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