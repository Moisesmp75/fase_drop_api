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

    const distrito = request.query.get('distrito');
    const grado = request.query.get('grado');
    const seccion = request.query.get('seccion');

    const getAlumnosUseCase = new GetAlumnosUseCase();
    const alumnos = await getAlumnosUseCase.execute({
      distrito: distrito || undefined,
      grado: grado ? parseInt(grado) : undefined,
      seccion: seccion || undefined,
      idUsuarioResponsable: decodedToken.user_id
    });

    const alumnosResponse = alumnos.map(alumno => ({
      id: alumno.getId(),
      nombre: alumno.getNombre(),
      apellido: alumno.getApellido(),
      dni: alumno.getDni(),
      edad: alumno.getEdad(),
      distrito: alumno.getDistrito(),
      ultimoGrado: alumno.getUltimoGrado(),
      ultimaSeccion: alumno.getUltimaSeccion(),
      ultimaPrediccion: alumno.getUltimaPrediccion(),
      notas: alumno.getNotas().map(nota => ({
        id: nota.getId(),
        grado: nota.getGrado(),
        seccion: nota.getSeccion(),
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
      }))
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