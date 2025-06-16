import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { GetNotasUseCase } from "../../../application/use-cases/nota/get-notas.use-case";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";
import { TipoPeriodo } from "../../../domain/model/enums/periodo.enum";

export const GetNotasFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

    const alumnoId = request.query.get('alumnoId');
    const tipoPeriodo = request.query.get('tipoPeriodo') as TipoPeriodo;
    const valorPeriodo = request.query.get('valorPeriodo');
    const anio = request.query.get('anio');

    if (!alumnoId) {
      return {
        status: 400,
        jsonBody: {
          message: "El ID del alumno es requerido"
        }
      };
    }

    if (tipoPeriodo && !Object.values(TipoPeriodo).includes(tipoPeriodo)) {
      return {
        status: 400,
        jsonBody: {
          message: `El tipo de período debe ser ${Object.values(TipoPeriodo).join(' o ')}`
        }
      };
    }

    const getNotasUseCase = new GetNotasUseCase();
    const notas = await getNotasUseCase.execute({
      alumnoId,
      tipoPeriodo: tipoPeriodo || undefined,
      valorPeriodo: valorPeriodo ? parseInt(valorPeriodo) : undefined,
      anio: anio ? parseInt(anio) : undefined
    });

    const notasResponse = notas.map(nota => ({
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
      comentario: nota.getComentario()
    }));

    return {
      status: 200,
      jsonBody: {
        notas: notasResponse
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