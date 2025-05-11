import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { GetAlumnosUseCase } from "../../../application/use-cases/alumno/get-alumnos.use-case";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";

export const GetAlumnosFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

    const grado = request.query.get('grado');
    const seccion = request.query.get('seccion');
    const distrito = request.query.get('distrito');

    const getAlumnosUseCase = new GetAlumnosUseCase();
    const alumnos = await getAlumnosUseCase.execute({
      grado: grado ? parseInt(grado) : undefined,
      seccion: seccion || undefined,
      distrito: distrito || undefined,
      idUsuarioResponsable: decodedToken.user_id
    });

    const alumnosResponse = alumnos.map(alumno => ({
      id: alumno.getId(),
      nombre: alumno.getNombre(),
      apellido: alumno.getApellido(),
      edad: alumno.getEdad(),
      grado: alumno.getGrado(),
      seccion: alumno.getSeccion(),
      distrito: alumno.getDistrito(),
      tipoPeriodo: alumno.getTipoPeriodo(),
      valorPeriodo: alumno.getValorPeriodo(),
      anio: alumno.getAnio()
    }));

    return {
      status: 200,
      jsonBody: {
        alumnos: alumnosResponse
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