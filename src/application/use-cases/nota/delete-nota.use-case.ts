import { NotaRepository } from "../../../domain/repositories/nota.repository";
import { DeleteNotaCommand } from "../../../domain/model/commands/nota/delete-nota.command";
import { TsNotaRepository } from "../../../infrastructure/storage-account/repositories/ts-nota.repository";

export class DeleteNotaUseCase {
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

  async execute(command: DeleteNotaCommand): Promise<void> {
    try {
      await this.notaRepository.delete(command.id, command.alumnoId);
    } catch (error) {
      throw new Error(`Error al eliminar la nota: ${error.message}`);
    }
  }
} 