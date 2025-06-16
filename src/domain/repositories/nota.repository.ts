import { Nota } from "../model/entites/nota.entity";
import { GetNotasQuery } from "../model/queries/nota/get-notas.query";

export interface NotaRepository {
  create(nota: Nota): Promise<Nota>;
  findById(id: string): Promise<Nota>;
  findByAlumnoId(alumnoId: string): Promise<Nota[]>;
  findByQuery(query: GetNotasQuery): Promise<Nota[]>;
  update(nota: Nota): Promise<Nota>;
  delete(id: string, alumnoId: string): Promise<void>;
} 