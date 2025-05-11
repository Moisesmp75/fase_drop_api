import { CreateNotaCommand } from "../../../domain/model/commands/nota/create-nota.command";
import { Nota } from "../../../domain/model/entites/nota.entity";
import { NotaRepository } from "../../../domain/repositories/nota.repository";
import { TsNotaRepository } from "../../../infrastructure/storage-account/repositories/ts-nota.repository";
import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { TsAlumnoRepository } from "../../../infrastructure/storage-account/repositories/ts-alumno.repository";

export class CreateNotaUseCase {
  private readonly notaRepository: NotaRepository;
  private readonly alumnoRepository: AlumnoRepository;

  constructor(notaRepository: NotaRepository = null, alumnoRepository: AlumnoRepository = null) {
    if (!notaRepository) {
      this.notaRepository = new TsNotaRepository(
        process.env["StorageAccountName"],
        process.env["StorageAccountKey"]
      );
    } else {
      this.notaRepository = notaRepository;
    }

    if (!alumnoRepository) {
      this.alumnoRepository = new TsAlumnoRepository(
        process.env["StorageAccountName"],
        process.env["StorageAccountKey"]
      );
    } else {
      this.alumnoRepository = alumnoRepository;
    }
  }

  async execute(command: CreateNotaCommand): Promise<Nota> {
    // Verificar que el alumno existe
    const alumno = await this.alumnoRepository.findById(command.alumnoId);
    if (!alumno) {
      throw new Error("El alumno no existe");
    }

    // Verificar que no exista una nota para el mismo período
    const notasExistentes = await this.notaRepository.findByQuery({
      alumnoId: command.alumnoId,
      tipoPeriodo: command.tipoPeriodo,
      valorPeriodo: command.valorPeriodo,
      anio: command.anio
    });

    if (notasExistentes.length > 0) {
      throw new Error("Ya existe una nota para este período");
    }

    const nota = new Nota(
      command.alumnoId,
      command.tipoPeriodo,
      command.valorPeriodo,
      command.anio,
      command.matematicas,
      command.comunicacion,
      command.ciencias_sociales,
      command.cta,
      command.ingles,
      command.asistencia,
      command.conducta,
      command.prediccion
    );

    return await this.notaRepository.create(nota);
  }
} 