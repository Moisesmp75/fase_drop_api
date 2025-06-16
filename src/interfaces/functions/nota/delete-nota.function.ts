import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DeleteNotaUseCase } from "../../../application/use-cases/nota/delete-nota.use-case";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";

export const DeleteNotaFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

    const notaId = request.params.notaId;
    const alumnoId = request.params.alumnoId;

    if (!notaId || !alumnoId) {
      return {
        status: 400,
        jsonBody: {
          message: "Se requiere el ID de la nota y el ID del alumno"
        }
      };
    }

    const deleteNotaUseCase = new DeleteNotaUseCase();
    await deleteNotaUseCase.execute({
      id: notaId,
      alumnoId: alumnoId
    });

    return {
      status: 200,
      jsonBody: {
        message: "Nota eliminada exitosamente"
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