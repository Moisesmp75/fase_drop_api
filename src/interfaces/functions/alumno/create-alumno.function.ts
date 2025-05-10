import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CreateAlumnoUseCase } from "../../../application/use-cases/alumno/create-alumno.use-case";
import { CreateAlumnoCommand } from "../../../domain/model/commands/alumno/create-alumno.command";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";

// interface CreateAlumnoRequest {
//   nombre: string;
//   apellido: string;
//   edad: number;
//   grado: number;
//   seccion: string;
//   conducta: number;
//   distrito: string;
//   asistencia?: number;
//   matematicas?: number;
//   comunicacion?: number;
//   ciencias_sociales?: number;
//   cta?: number;
//   ingles?: number;
// }

export const CreateAlumnoFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

    const body = await request.json() as CreateAlumnoCommand;
    
    const requiredFields = ['nombre', 'apellido', 'edad', 'grado', 'seccion', 'conducta', 'distrito'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return {
        status: 400,
        jsonBody: {
          message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        }
      };
    }

    const createAlumnoUseCase = new CreateAlumnoUseCase();
    
    const alumno = await createAlumnoUseCase.execute({
      ...body,
      idUsuarioResponsable: decodedToken.user_id
    });

    return {
      status: 201,
      jsonBody: {
        message: "Alumno registrado exitosamente",
        alumno: {
          id: alumno.getId(),
          nombre: alumno.getNombre(),
          apellido: alumno.getApellido(),
          edad: alumno.getEdad(),
          grado: alumno.getGrado(),
          seccion: alumno.getSeccion(),
          conducta: alumno.getConducta(),
          distrito: alumno.getDistrito(),
          asistencia: alumno.getAsistencia(),
          matematicas: alumno.getMatematicas(),
          comunicacion: alumno.getComunicacion(),
          ciencias_sociales: alumno.getCienciasSociales(),
          cta: alumno.getCta(),
          ingles: alumno.getIngles(),
          prediccion: alumno.getPrediccion()
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