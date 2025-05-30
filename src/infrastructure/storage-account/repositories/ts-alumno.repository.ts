import { AlumnoRepository } from "../../../domain/repositories/alumno.repository";
import { Alumno } from "../../../domain/model/entites/alumno.entity";
import { AzureTableClient } from "./base.repository";
import { AlumnoEntity } from "../entities/alumno.entity";
import { v4 as uuidv4 } from 'uuid';

export class TsAlumnoRepository implements AlumnoRepository {
  private readonly tableName;
  private readonly tableClient: AzureTableClient;

  constructor(accountName: string, accountKey: string) {
    this.tableName = 'alumnos';
    this.tableClient = new AzureTableClient(accountName, accountKey, this.tableName);
  }

  async init(): Promise<void> {
    await this.tableClient.ensureTableExists();
  }

  private generatePartitionKey(idUsuarioResponsable: string): string {
    return idUsuarioResponsable;
  }

  private generateRowKey(nombre: string, apellido: string): string {
    const timestamp = new Date().getTime();
    return `${nombre}_${apellido}_${timestamp}`;
  }

  async create(alumno: Alumno): Promise<Alumno> {
    const alumnoEntity: AlumnoEntity = {
      partitionKey: this.generatePartitionKey(alumno.getIdUsuarioResponsable()),
      rowKey: this.generateRowKey(alumno.getNombre(), alumno.getApellido()),
      id: uuidv4(),
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

      return result.map(alumnoEntity => new Alumno(
        alumnoEntity.nombre,
        alumnoEntity.apellido,
        alumnoEntity.dni,
        alumnoEntity.edad,
        alumnoEntity.distrito,
        alumnoEntity.idUsuarioResponsable,
        alumnoEntity.id
      ));
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

      return result.map(alumnoEntity => new Alumno(
        alumnoEntity.nombre,
        alumnoEntity.apellido,
        alumnoEntity.dni,
        alumnoEntity.edad,
        alumnoEntity.distrito,
        alumnoEntity.idUsuarioResponsable,
        alumnoEntity.id
      ));
    } catch (error) {
      throw new Error("Error al buscar alumnos por usuario responsable");
    }
  }

  async update(alumno: Alumno): Promise<Alumno> {
    try {
      const alumnoEntity: AlumnoEntity = {
        partitionKey: this.generatePartitionKey(alumno.getIdUsuarioResponsable()),
        rowKey: this.generateRowKey(alumno.getNombre(), alumno.getApellido()),
        id: alumno.getId(),
        idUsuarioResponsable: alumno.getIdUsuarioResponsable(),
        nombre: alumno.getNombre(),
        apellido: alumno.getApellido(),
        dni: alumno.getDni(),
        edad: alumno.getEdad(),
        distrito: alumno.getDistrito()
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

      const alumnoEntity: AlumnoEntity = {
        partitionKey: this.generatePartitionKey(alumno.getIdUsuarioResponsable()),
        rowKey: this.generateRowKey(alumno.getNombre(), alumno.getApellido()),
        id: alumno.getId(),
        idUsuarioResponsable: alumno.getIdUsuarioResponsable(),
        nombre: alumno.getNombre(),
        apellido: alumno.getApellido(),
        dni: alumno.getDni(),
        edad: alumno.getEdad(),
        distrito: alumno.getDistrito()
      };

      await this.tableClient.delete(alumnoEntity);
    } catch (error) {
      throw new Error("Error al eliminar el alumno");
    }
  }

  async getAll(): Promise<Alumno[]> {
    try {
      const result = await this.tableClient.getAll<AlumnoEntity>();
      return result.map(alumnoEntity => new Alumno(
        alumnoEntity.nombre,
        alumnoEntity.apellido,
        alumnoEntity.dni,
        alumnoEntity.edad,
        alumnoEntity.distrito,
        alumnoEntity.idUsuarioResponsable,
        alumnoEntity.id
      ));
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
      throw new Error("Error al buscar el alumno por DNI");
    }
  }
} 