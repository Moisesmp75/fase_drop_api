import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CreateAlumnoUseCase } from "../../../application/use-cases/alumno/create-alumno.use-case";
import { CreateAlumnoCommand } from "../../../domain/model/commands/alumno/create-alumno.command";
import { JwtTokenService } from "../../../application/internal/outbound-services/jwt-token.service";

interface CreateAlumnoRequest {
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  distrito: string;
  grado?: number;
  seccion?: string;
  tipoPeriodo?: string;
  valorPeriodo?: number;
  anio?: number;
}

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

    const body = await request.json() as CreateAlumnoRequest;
    
    // Extraer solo los campos necesarios para crear un alumno
    const alumnoData: CreateAlumnoCommand = {
      nombre: body.nombre,
      apellido: body.apellido,
      dni: body.dni,
      edad: body.edad,
      distrito: body.distrito,
      idUsuarioResponsable: decodedToken.user_id
    };
    
    const requiredFields = [
      'nombre', 
      'apellido', 
      'dni',
      'edad', 
      'distrito'
    ];
    const missingFields = requiredFields.filter(field => !alumnoData[field]);
    
    if (missingFields.length > 0) {
      return {
        status: 400,
        jsonBody: {
          message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        }
      };
    }

    const createAlumnoUseCase = new CreateAlumnoUseCase();
    const alumno = await createAlumnoUseCase.execute(alumnoData);

    return {
      status: 201,
      jsonBody: {
        message: "Alumno registrado exitosamente",
        alumno: {
          id: alumno.getId(),
          nombre: alumno.getNombre(),
          apellido: alumno.getApellido(),
          dni: alumno.getDni(),
          edad: alumno.getEdad(),
          distrito: alumno.getDistrito()
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