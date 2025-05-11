import { Nota } from "../../../domain/model/entites/nota.entity";
import { NotaRepository } from "../../../domain/repositories/nota.repository";
import { GetNotasQuery } from "../../../domain/model/queries/nota/get-notas.query";
import { TsNotaRepository } from "../../../infrastructure/storage-account/repositories/ts-nota.repository";

export class GetNotasUseCase {
  private readonly notaRepository: NotaRepository;

  constructor(notaRepository: NotaRepository = null) {
    if (!notaRepository) {
      this.notaRepository = new TsNotaRepository(
        process.env["StorageAccountName"],
        process.env["StorageAccountKey"]
      );
    } else {
      this.notaRepository = notaRepository;
    }
  }

  async execute(query: GetNotasQuery): Promise<Nota[]> {
    if (!query.alumnoId) {
      throw new Error("El ID del alumno es requerido");
    }

    return await this.notaRepository.findByQuery(query);
  }
} 