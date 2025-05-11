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
    const alumno = new Alumno(
      command.nombre,
      command.apellido,
      command.edad,
      command.grado,
      command.seccion,
      command.distrito,
      null, // id
      command.idUsuarioResponsable,
      command.tipoPeriodo,
      command.valorPeriodo,
      command.anio
    );

    return await this.alumnoRepository.create(alumno);
  }
} 