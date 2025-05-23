import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { GetAlumnoByIdUseCase } from "../../../application/use-cases/alumno/get-alumno-by-id.use-case";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";

export const GetAlumnoByIdFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

    const getAlumnoByIdUseCase = new GetAlumnoByIdUseCase();
    const alumno = await getAlumnoByIdUseCase.execute({ id });

    if (!alumno) {
      return {
        status: 404,
        jsonBody: {
          message: "Alumno no encontrado"
        }
      };
    }

    return {
      status: 200,
      jsonBody: {
        id: alumno.getId(),
        nombre: alumno.getNombre(),
        apellido: alumno.getApellido(),
        dni: alumno.getDni(),
        edad: alumno.getEdad(),
        distrito: alumno.getDistrito()
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