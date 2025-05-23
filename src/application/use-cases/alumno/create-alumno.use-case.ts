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
    // Verificar si ya existe un alumno con el mismo DNI
    const alumnoExistente = await this.alumnoRepository.findByDni(command.dni);

    if (alumnoExistente) {
      throw new Error(`Ya existe un alumno registrado con el DNI ${command.dni}`);
    }

    const alumno = new Alumno(
      command.nombre,
      command.apellido,
      command.dni,
      command.edad,
      command.distrito,
      command.idUsuarioResponsable
    );

    return await this.alumnoRepository.create(alumno);
  }
} 