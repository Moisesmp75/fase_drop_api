import { DeleteAlumnoCommand } from "../../../domain/model/commands/alumno/delete-alumno.command";
import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { TsAlumnoRepository } from "../../../infrastructure/storage-account/repositories/ts-alumno.repository";

export class DeleteAlumnoUseCase {
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

  async execute(command: DeleteAlumnoCommand): Promise<void> {
    // Verificar que el alumno existe
    const alumno = await this.alumnoRepository.findById(command.id);
    if (!alumno) {
      throw new Error("El alumno no existe");
    }

    // Eliminar el alumno y sus notas asociadas
    await this.alumnoRepository.delete(command.id);
  }
} 