import { Alumno } from "../../../domain/model/entites/alumno.entity";
import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { GetAlumnosQuery } from "../../../domain/model/queries/alumno/get-alumnos.query";
import { TsAlumnoRepository } from "../../../infrastructure/storage-account/repositories/ts-alumno.repository";
import { NotaRepository } from "../../../domain/repositories/nota.repository";
import { TsNotaRepository } from "../../../infrastructure/storage-account/repositories/ts-nota.repository";

export class GetAlumnosUseCase {
  private readonly alumnoRepository: AlumnoRepository;
  private readonly notaRepository: NotaRepository;

  constructor(
    alumnoRepository: AlumnoRepository = null,
    notaRepository: NotaRepository = null
  ) {
    if (!alumnoRepository) {
      this.alumnoRepository = new TsAlumnoRepository(
        process.env["StorageAccountName"],
        process.env["StorageAccountKey"]
      );
    } else {
      this.alumnoRepository = alumnoRepository;
    }

    if (!notaRepository) {
      this.notaRepository = new TsNotaRepository(
        process.env["StorageAccountName"],
        process.env["StorageAccountKey"]
      );
    } else {
      this.notaRepository = notaRepository;
    }
  }

  async execute(query: GetAlumnosQuery): Promise<Alumno[]> {
    const alumnos = await this.alumnoRepository.findByUsuarioResponsable(query.idUsuarioResponsable);
    
    const alumnosFiltrados = alumnos.filter(alumno => {
      if (query.distrito && alumno.getDistrito() !== query.distrito) return false;
      return true;
    });

    // Obtener las notas más recientes para cada alumno
    for (const alumno of alumnosFiltrados) {
      const notas = await this.notaRepository.findByAlumnoId(alumno.getId());
      if (notas.length > 0) {
        // Ordenar por año y valor del período de forma descendente
        const notasOrdenadas = notas.sort((a, b) => {
          if (a.getAnio() !== b.getAnio()) {
            return b.getAnio() - a.getAnio();
          }
          return b.getValorPeriodo() - a.getValorPeriodo();
        });

        const ultimaNota = notasOrdenadas[0];
        alumno.setUltimoGrado(ultimaNota.getGrado());
        alumno.setUltimaSeccion(ultimaNota.getSeccion());
        alumno.setUltimaPrediccion(ultimaNota.getPrediccion());
      }
    }

    return alumnosFiltrados;
  }
} 