import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { Alumno } from "../../../domain/model/entites/alumno.entity";
import { AzureTableClient } from "./base.repository";
import { AlumnoEntity } from "../entities/alumno.entity";
import { NotaEntity } from "../entities/nota.entity";
import { v4 as uuidv4 } from 'uuid';
import { Nota } from "../../../domain/model/entites/nota.entity";

export class TsAlumnoRepository implements AlumnoRepository {
  private readonly tableName;
  private readonly tableClient: AzureTableClient;
  private readonly notaTableClient: AzureTableClient;

  constructor(accountName: string, accountKey: string) {
    this.tableName = 'alumnos';
    this.tableClient = new AzureTableClient(accountName, accountKey, this.tableName);
    this.notaTableClient = new AzureTableClient(accountName, accountKey, 'notas');
  }

  async init(): Promise<void> {
    await this.tableClient.ensureTableExists();
    await this.notaTableClient.ensureTableExists();
  }

  private generatePartitionKey(idUsuarioResponsable: string): string {
    return idUsuarioResponsable;
  }

  private async getNotasByAlumnoId(alumnoId: string): Promise<NotaEntity[]> {
    try {
      return await this.notaTableClient.query<NotaEntity>(`alumnoId eq '${alumnoId}'`);
    } catch (error) {
      console.error('Error al obtener notas del alumno:', error);
      return [];
    }
  }

  async create(alumno: Alumno): Promise<Alumno> {
    const alumnoId = uuidv4();
    const alumnoEntity: AlumnoEntity = {
      partitionKey: this.generatePartitionKey(alumno.getIdUsuarioResponsable()),
      rowKey: alumnoId,
      id: alumnoId,
      idUsuarioResponsable: alumno.getIdUsuarioResponsable(),
      nombre: alumno.getNombre(),
      apellido: alumno.getApellido(),
      dni: alumno.getDni(),
      edad: alumno.getEdad(),
      distrito: alumno.getDistrito()
    };

    await this.tableClient.insert(alumnoEntity);

    return new Alumno(
      alumnoEntity.nombre,
      alumnoEntity.apellido,
      alumnoEntity.dni,
      alumnoEntity.edad,
      alumnoEntity.distrito,
      alumnoEntity.idUsuarioResponsable,
      alumnoEntity.id
    );
  }

  async findById(id: string): Promise<Alumno> {
    try {
      const result = await this.tableClient.query<AlumnoEntity>(`id eq '${id}'`);
      
      if (!result || result.length === 0) {
        return null;
      }

      const alumnoEntity = result[0];
      alumnoEntity.notas = await this.getNotasByAlumnoId(alumnoEntity.id);

      return new Alumno(
        alumnoEntity.nombre,
        alumnoEntity.apellido,
        alumnoEntity.dni,
        alumnoEntity.edad,
        alumnoEntity.distrito,
        alumnoEntity.idUsuarioResponsable,
        alumnoEntity.id
      );
    } catch (error) {
      throw new Error("Error al buscar el alumno por ID");
    }
  }

  async findByNombreApellido(nombre: string, apellido: string): Promise<Alumno[]> {
    try {
      const rowKeyPrefix = `${nombre}_${apellido}`;
      const result = await this.tableClient.query<AlumnoEntity>(`startswith(rowKey, '${rowKeyPrefix}')`);
      
      if (!result || result.length === 0) {
        return [];
      }

      const alumnos = await Promise.all(result.map(async alumnoEntity => {
        alumnoEntity.notas = await this.getNotasByAlumnoId(alumnoEntity.id);
        return new Alumno(
          alumnoEntity.nombre,
          alumnoEntity.apellido,
          alumnoEntity.dni,
          alumnoEntity.edad,
          alumnoEntity.distrito,
          alumnoEntity.idUsuarioResponsable,
          alumnoEntity.id
        );
      }));

      return alumnos;
    } catch (error) {
      throw new Error("Error al buscar alumnos por nombre y apellido");
    }
  }

  async findByUsuarioResponsable(idUsuarioResponsable: string): Promise<Alumno[]> {
    try {
      const query = `PartitionKey eq '${idUsuarioResponsable}'`;
      const result = await this.tableClient.query<AlumnoEntity>(query);
      
      if (!result || result.length === 0) {
        return [];
      }

      const alumnos = await Promise.all(result.map(async alumnoEntity => {
        alumnoEntity.notas = await this.getNotasByAlumnoId(alumnoEntity.id);
        return new Alumno(
          alumnoEntity.nombre,
          alumnoEntity.apellido,
          alumnoEntity.dni,
          alumnoEntity.edad,
          alumnoEntity.distrito,
          alumnoEntity.idUsuarioResponsable,
          alumnoEntity.id,
          alumnoEntity.notas.map(nota => new Nota(
            nota.alumnoId,
            nota.grado as number,
            nota.seccion,
            nota.tipoPeriodo,
            nota.valorPeriodo,
            nota.anio,
            nota.matematicas,
            nota.comunicacion,
            nota.ciencias_sociales,
            nota.cta,
            nota.ingles,
            nota.asistencia,
            nota.conducta,
            nota.prediccion,
            nota.comentario,
            nota.id,
            new Date(nota.fechaPrediccion)
          ))
        );
      }));

      return alumnos;
    } catch (error) {
      throw new Error("Error al buscar alumnos por usuario responsable");
    }
  }

  async update(alumno: Alumno): Promise<Alumno> {
    try {
      const alumnoEntity: AlumnoEntity = {
        partitionKey: this.generatePartitionKey(alumno.getIdUsuarioResponsable()),
        rowKey: alumno.getId(),
        id: alumno.getId(),
        idUsuarioResponsable: alumno.getIdUsuarioResponsable(),
        nombre: alumno.getNombre(),
        apellido: alumno.getApellido(),
        dni: alumno.getDni(),
        edad: alumno.getEdad(),
        distrito: alumno.getDistrito(),
        notas: await this.getNotasByAlumnoId(alumno.getId())
      };

      await this.tableClient.update(alumnoEntity);
      return alumno;
    } catch (error) {
      throw new Error("Error al actualizar el alumno");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const alumno = await this.findById(id);
      if (!alumno) {
        throw new Error("Alumno no encontrado");
      }

      // Eliminar todas las notas asociadas al alumno
      console.log(4);
      const notas = await this.getNotasByAlumnoId(id);
      console.log(3);
      await Promise.all(notas.map(nota => this.notaTableClient.delete(nota)));

      const alumnoEntity: AlumnoEntity = {
        partitionKey: this.generatePartitionKey(alumno.getIdUsuarioResponsable()),
        rowKey: alumno.getId(),
        id: alumno.getId(),
        idUsuarioResponsable: alumno.getIdUsuarioResponsable(),
        nombre: alumno.getNombre(),
        apellido: alumno.getApellido(),
        dni: alumno.getDni(),
        edad: alumno.getEdad(),
        distrito: alumno.getDistrito()
      };
      console.log(alumnoEntity);
      await this.tableClient.delete(alumnoEntity);
    } catch (error) {
      throw new Error("Error al eliminar el alumno");
    }
  }

  async getAll(): Promise<Alumno[]> {
    try {
      const result = await this.tableClient.getAll<AlumnoEntity>();
      const alumnos = await Promise.all(result.map(async alumnoEntity => {
        alumnoEntity.notas = await this.getNotasByAlumnoId(alumnoEntity.id);
        return new Alumno(
          alumnoEntity.nombre,
          alumnoEntity.apellido,
          alumnoEntity.dni,
          alumnoEntity.edad,
          alumnoEntity.distrito,
          alumnoEntity.idUsuarioResponsable,
          alumnoEntity.id
        );
      }));
      return alumnos;
    } catch (error) {
      throw new Error("Error al obtener todos los alumnos");
    }
  }

  async findByDni(dni: string): Promise<Alumno> {
    try {
      const result = await this.tableClient.query<AlumnoEntity>(`dni eq '${dni}'`);
      
      if (!result || result.length === 0) {
        return null;
      }

      const alumnoEntity = result[0];
      alumnoEntity.notas = await this.getNotasByAlumnoId(alumnoEntity.id);

      return new Alumno(
        alumnoEntity.nombre,
        alumnoEntity.apellido,
        alumnoEntity.dni,
        alumnoEntity.edad,
        alumnoEntity.distrito,
        alumnoEntity.idUsuarioResponsable,
        alumnoEntity.id
      );
    } catch (error) {
      throw new Error("Error al buscar alumno por DNI");
    }
  }
} 