import { Alumno } from "../../../domain/model/entites/alumno.entity";
import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { GetAlumnosQuery } from "../../../domain/model/queries/alumno/get-alumnos.query";
import { TsAlumnoRepository } from "../../../infrastructure/storage-account/repositories/ts-alumno.repository";

export class GetAlumnosUseCase {
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

  async execute(query: GetAlumnosQuery): Promise<Alumno[]> {
    const alumnos = await this.alumnoRepository.findByUsuarioResponsable(query.idUsuarioResponsable);
    
    return alumnos.filter(alumno => {
      if (query.grado && alumno.getGrado() !== query.grado) return false;
      if (query.seccion && alumno.getSeccion() !== query.seccion) return false;
      if (query.distrito && alumno.getDistrito() !== query.distrito) return false;
      return true;
    });
  }
} 