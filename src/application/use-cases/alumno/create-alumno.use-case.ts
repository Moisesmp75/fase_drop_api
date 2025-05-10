import { CreateAlumnoCommand } from "../../../domain/model/commands/alumno/create-alumno.command";
import { Alumno } from "../../../domain/model/entites/alumno.entity";
import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { TsAlumnoRepository } from "../../../infrastructure/storage-account/repositories/ts-alumno.repository";

export class CreateAlumnoUseCase {
  private readonly alumnoRepository: AlumnoRepository;
  
  constructor(alumnoRepository: AlumnoRepository = null) {
    if (!alumnoRepository) {
      this.alumnoRepository = new TsAlumnoRepository(
        process.env["StorageAccountName"],
        process.env["StorageAccountKey"]
      );
    } else {
      this.alumnoRepository = alumnoRepository;
    }
  }

  async execute(command: CreateAlumnoCommand): Promise<Alumno> {
    console.log("Comando recibido: ", command);
    const alumno = new Alumno(
      command.nombre,
      command.apellido,
      command.edad,
      command.grado,
      command.seccion,
      command.conducta,
      command.distrito,
      command.asistencia || 0,
      command.matematicas || 0,
      command.comunicacion || 0,
      command.ciencias_sociales || 0,
      command.cta || 0,
      command.ingles || 0,
      null,
      command.prediccion || 0,
      command.idUsuarioResponsable
    );
    console.log("Alumno creado: ", alumno);
    return await this.alumnoRepository.create(alumno);
  }
} 