import { Alumno } from "../../../domain/model/entites/alumno.entity";
import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { GetAlumnoByIdQuery } from "../../../domain/model/queries/alumno/get-alumno-by-id.query";
import { TsAlumnoRepository } from "../../../infrastructure/storage-account/repositories/ts-alumno.repository";

export class GetAlumnoByIdUseCase {
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

  async execute(query: GetAlumnoByIdQuery): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findById(query.id);
    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }
    return alumno;
  }
} 