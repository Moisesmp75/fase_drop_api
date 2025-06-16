import { CreateNotaCommand } from "../../../domain/model/commands/nota/create-nota.command";
import { Nota } from "../../../domain/model/entites/nota.entity";
import { NotaRepository } from "../../../domain/repositories/nota.repository";
import { TsNotaRepository } from "../../../infrastructure/storage-account/repositories/ts-nota.repository";
import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { TsAlumnoRepository } from "../../../infrastructure/storage-account/repositories/ts-alumno.repository";
import { PredictionService } from "../../internal/outbound-services/prediction.service";

export class CreateNotaUseCase {
  private readonly notaRepository: NotaRepository;
  private readonly alumnoRepository: AlumnoRepository;
  private readonly predictionService: PredictionService;

  constructor(
    notaRepository: NotaRepository = null, 
    alumnoRepository: AlumnoRepository = null,
    predictionService: PredictionService = null
  ) {
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

    this.predictionService = predictionService || new PredictionService();
  }

  async execute(command: CreateNotaCommand): Promise<Nota> {
    // Verificar que el alumno existe
    const alumno = await this.alumnoRepository.findById(command.alumnoId);
    if (!alumno) {
      throw new Error("El alumno no existe");
    }

    // Verificar que no exista una nota para el mismo alumno, año, grado, sección y período
    const notasExistentes = await this.notaRepository.findByQuery({
      alumnoId: command.alumnoId,
      tipoPeriodo: command.tipoPeriodo,
      valorPeriodo: command.valorPeriodo,
      anio: command.anio,
      grado: command.grado,
      seccion: command.seccion
    });

    if (notasExistentes.length > 0) {
      throw new Error("Ya existe una nota para este alumno en el mismo año, grado, sección y período");
    }

    const prediccion = await this.predictionService.getPrediction({
      edad: alumno.getEdad(),
      grado: command.grado,
      conducta: command.conducta,
      asistencia: command.asistencia,
      matematicas: command.matematicas,
      comunicacion: command.comunicacion,
      ciencias_sociales: command.ciencias_sociales,
      cta: command.cta,
      ingles: command.ingles
    });

    const nota = new Nota(
      command.alumnoId,
      command.grado,
      command.seccion,
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
      prediccion,
      command.comentario
    );

    return await this.notaRepository.create(nota);
  }
} 