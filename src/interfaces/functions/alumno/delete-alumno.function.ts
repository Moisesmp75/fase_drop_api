import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DeleteAlumnoCommand } from "../../../domain/model/commands/alumno/delete-alumno.command";
import { DeleteAlumnoUseCase } from "../../../application/use-cases/alumno/delete-alumno.use-case";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";

export const DeleteAlumnoFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: {
          message: "El ID del alumno es requerido"
        }
      };
    }

    const deleteAlumnoUseCase = new DeleteAlumnoUseCase();
    await deleteAlumnoUseCase.execute(new DeleteAlumnoCommand(id));

    return {
      status: 200,
      jsonBody: {
        message: "Alumno eliminado exitosamente"
      }
    };
  } catch (error) {
    return {
      status: error.message.includes("no existe") ? 404 : 500,
      jsonBody: {
        message: error.message || "Error al eliminar el alumno"
      }
    };
  }
}; 