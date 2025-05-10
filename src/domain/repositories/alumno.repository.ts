import { Alumno } from "../model/entites/alumno.entity";

export interface AlumnoRepository {
  create(alumno: Alumno): Promise<Alumno>;
  findById(id: string): Promise<Alumno>;
  findByNombreApellido(nombre: string, apellido: string): Promise<Alumno[]>;
  findByUsuarioResponsable(idUsuarioResponsable: string): Promise<Alumno[]>;
  update(alumno: Alumno): Promise<Alumno>;
  delete(id: string): Promise<void>;
  getAll(): Promise<Alumno[]>;
}