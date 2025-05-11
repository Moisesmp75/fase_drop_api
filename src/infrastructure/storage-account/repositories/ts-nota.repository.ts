import { NotaRepository } from "../../../domain/repositories/nota.repository";
import { Nota } from "../../../domain/model/entites/nota.entity";
import { AzureTableClient } from "./base.repository";
import { NotaEntity } from "../entities/nota.entity";
import { v4 as uuidv4 } from 'uuid';
import { GetNotasQuery } from "../../../domain/model/queries/nota/get-notas.query";

export class TsNotaRepository implements NotaRepository {
  private readonly tableName;
  private readonly tableClient: AzureTableClient;

  constructor(accountName: string, accountKey: string) {
    this.tableName = 'notas';
    this.tableClient = new AzureTableClient(accountName, accountKey, this.tableName);
  }

  async init(): Promise<void> {
    await this.tableClient.ensureTableExists();
  }

  private generatePartitionKey(alumnoId: string, anio: number): string {
    return `${alumnoId}_${anio}`;
  }

  private generateRowKey(tipoPeriodo: string, valorPeriodo: number): string {
    return `${tipoPeriodo}_${valorPeriodo}`;
  }

  async create(nota: Nota): Promise<Nota> {
    const notaEntity: NotaEntity = {
      partitionKey: this.generatePartitionKey(nota.getAlumnoId(), nota.getAnio()),
      rowKey: this.generateRowKey(nota.getTipoPeriodo(), nota.getValorPeriodo()),
      id: uuidv4(),
      alumnoId: nota.getAlumnoId(),
      tipoPeriodo: nota.getTipoPeriodo(),
      valorPeriodo: nota.getValorPeriodo(),
      anio: nota.getAnio(),
      matematicas: nota.getMatematicas(),
      comunicacion: nota.getComunicacion(),
      ciencias_sociales: nota.getCienciasSociales(),
      cta: nota.getCta(),
      ingles: nota.getIngles(),
      asistencia: nota.getAsistencia(),
      conducta: nota.getConducta(),
      prediccion: nota.getPrediccion()
    };

    await this.tableClient.insert(notaEntity);

    return new Nota(
      notaEntity.alumnoId,
      notaEntity.tipoPeriodo,
      notaEntity.valorPeriodo,
      notaEntity.anio,
      notaEntity.matematicas,
      notaEntity.comunicacion,
      notaEntity.ciencias_sociales,
      notaEntity.cta,
      notaEntity.ingles,
      notaEntity.asistencia,
      notaEntity.conducta,
      notaEntity.prediccion,
      notaEntity.id
    );
  }

  async findById(id: string): Promise<Nota> {
    try {
      const result = await this.tableClient.query<NotaEntity>(`id eq '${id}'`);
      
      if (!result || result.length === 0) {
        return null;
      }

      const notaEntity = result[0];
      return new Nota(
        notaEntity.alumnoId,
        notaEntity.tipoPeriodo,
        notaEntity.valorPeriodo,
        notaEntity.anio,
        notaEntity.matematicas,
        notaEntity.comunicacion,
        notaEntity.ciencias_sociales,
        notaEntity.cta,
        notaEntity.ingles,
        notaEntity.asistencia,
        notaEntity.conducta,
        notaEntity.prediccion,
        notaEntity.id
      );
    } catch (error) {
      throw new Error("Error al buscar la nota por ID");
    }
  }

  async findByAlumnoId(alumnoId: string): Promise<Nota[]> {
    try {
      const query = `PartitionKey ge '${alumnoId}_' and PartitionKey lt '${alumnoId}_~'`;
      const result = await this.tableClient.query<NotaEntity>(query);
      
      if (!result || result.length === 0) {
        return [];
      }

      return result.map(notaEntity => new Nota(
        notaEntity.alumnoId,
        notaEntity.tipoPeriodo,
        notaEntity.valorPeriodo,
        notaEntity.anio,
        notaEntity.matematicas,
        notaEntity.comunicacion,
        notaEntity.ciencias_sociales,
        notaEntity.cta,
        notaEntity.ingles,
        notaEntity.asistencia,
        notaEntity.conducta,
        notaEntity.prediccion,
        notaEntity.id
      ));
    } catch (error) {
      throw new Error("Error al buscar notas por alumno");
    }
  }

  async findByQuery(query: GetNotasQuery): Promise<Nota[]> {
    try {
      let filter = `PartitionKey ge '${query.alumnoId}_' and PartitionKey lt '${query.alumnoId}_~'`;
      
      if (query.tipoPeriodo) {
        filter += ` and tipoPeriodo eq '${query.tipoPeriodo}'`;
      }
      
      if (query.valorPeriodo) {
        filter += ` and valorPeriodo eq ${query.valorPeriodo}`;
      }
      
      if (query.anio) {
        filter += ` and anio eq ${query.anio}`;
      }

      const result = await this.tableClient.query<NotaEntity>(filter);
      
      if (!result || result.length === 0) {
        return [];
      }

      return result.map(notaEntity => new Nota(
        notaEntity.alumnoId,
        notaEntity.tipoPeriodo,
        notaEntity.valorPeriodo,
        notaEntity.anio,
        notaEntity.matematicas,
        notaEntity.comunicacion,
        notaEntity.ciencias_sociales,
        notaEntity.cta,
        notaEntity.ingles,
        notaEntity.asistencia,
        notaEntity.conducta,
        notaEntity.prediccion,
        notaEntity.id
      ));
    } catch (error) {
      throw new Error("Error al buscar notas con los filtros especificados");
    }
  }

  async update(nota: Nota): Promise<Nota> {
    try {
      const notaEntity: NotaEntity = {
        partitionKey: this.generatePartitionKey(nota.getAlumnoId(), nota.getAnio()),
        rowKey: this.generateRowKey(nota.getTipoPeriodo(), nota.getValorPeriodo()),
        id: nota.getId(),
        alumnoId: nota.getAlumnoId(),
        tipoPeriodo: nota.getTipoPeriodo(),
        valorPeriodo: nota.getValorPeriodo(),
        anio: nota.getAnio(),
        matematicas: nota.getMatematicas(),
        comunicacion: nota.getComunicacion(),
        ciencias_sociales: nota.getCienciasSociales(),
        cta: nota.getCta(),
        ingles: nota.getIngles(),
        asistencia: nota.getAsistencia(),
        conducta: nota.getConducta(),
        prediccion: nota.getPrediccion()
      };

      await this.tableClient.update(notaEntity);
      return nota;
    } catch (error) {
      throw new Error("Error al actualizar la nota");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const nota = await this.findById(id);
      if (!nota) {
        throw new Error("Nota no encontrada");
      }

      const notaEntity: NotaEntity = {
        partitionKey: this.generatePartitionKey(nota.getAlumnoId(), nota.getAnio()),
        rowKey: this.generateRowKey(nota.getTipoPeriodo(), nota.getValorPeriodo()),
        id: nota.getId(),
        alumnoId: nota.getAlumnoId(),
        tipoPeriodo: nota.getTipoPeriodo(),
        valorPeriodo: nota.getValorPeriodo(),
        anio: nota.getAnio(),
        matematicas: nota.getMatematicas(),
        comunicacion: nota.getComunicacion(),
        ciencias_sociales: nota.getCienciasSociales(),
        cta: nota.getCta(),
        ingles: nota.getIngles(),
        asistencia: nota.getAsistencia(),
        conducta: nota.getConducta(),
        prediccion: nota.getPrediccion()
      };

      await this.tableClient.delete(notaEntity);
    } catch (error) {
      throw new Error("Error al eliminar la nota");
    }
  }
} 