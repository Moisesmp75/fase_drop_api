import { NotaRepository } from "../../../domain/repositories/nota.repository";
import { Nota } from "../../../domain/model/entites/nota.entity";
import { AzureTableClient } from "./base.repository";
import { NotaEntity } from "../entities/nota.entity";
import { v4 as uuidv4 } from 'uuid';
import { GetNotasQuery } from "../../../domain/model/queries/nota/get-notas.query";
import { TipoPeriodo } from "../../../domain/model/enums/periodo.enum";

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

  private generateRowKey(tipoPeriodo: string, valorPeriodo: number, grado: number, seccion: string): string {
    return `${tipoPeriodo}_${valorPeriodo}_${grado}_${seccion}`;
  }

  private async validateNotaExistente(alumnoId: string, tipoPeriodo: TipoPeriodo, valorPeriodo: number, anio: number, grado: number, seccion: string): Promise<void> {
    const query = `PartitionKey eq '${this.generatePartitionKey(alumnoId, anio)}' and RowKey eq '${this.generateRowKey(tipoPeriodo, valorPeriodo, grado, seccion)}'`;
    const result = await this.tableClient.query<NotaEntity>(query);

    if (result && result.length > 0) {
      throw new Error(`Ya existe una nota registrada para el ${tipoPeriodo.toLowerCase()} ${valorPeriodo} del año ${anio} en el grado ${grado} sección ${seccion}`);
    }

    // Validar que el valor del período sea válido según el tipo
    if (tipoPeriodo === TipoPeriodo.BIMESTRE && (valorPeriodo < 1 || valorPeriodo > 4)) {
      throw new Error('El valor del bimestre debe estar entre 1 y 4');
    }
    if (tipoPeriodo === TipoPeriodo.TRIMESTRE && (valorPeriodo < 1 || valorPeriodo > 3)) {
      throw new Error('El valor del trimestre debe estar entre 1 y 3');
    }

    // Validar que no se salte períodos
    const notasExistentes = await this.findByQuery({
      alumnoId,
      tipoPeriodo,
      anio,
      grado,
      seccion
    });

    if (notasExistentes.length > 0) {
      const valoresExistentes = notasExistentes.map(n => n.getValorPeriodo()).sort((a, b) => a - b);
      const maxValor = Math.max(...valoresExistentes);
      
      if (valorPeriodo <= maxValor) {
        throw new Error(`Ya se han registrado notas hasta el ${tipoPeriodo.toLowerCase()} ${maxValor}. El siguiente valor válido es ${maxValor + 1}`);
      }
    }
  }

  async create(nota: Nota): Promise<Nota> {
    // Validar que no exista una nota para el mismo período
    await this.validateNotaExistente(
      nota.getAlumnoId(),
      nota.getTipoPeriodo(),
      nota.getValorPeriodo(),
      nota.getAnio(),
      nota.getGrado(),
      nota.getSeccion()
    );

    const notaEntity: NotaEntity = {
      partitionKey: this.generatePartitionKey(nota.getAlumnoId(), nota.getAnio()),
      rowKey: this.generateRowKey(nota.getTipoPeriodo(), nota.getValorPeriodo(), nota.getGrado(), nota.getSeccion()),
      id: uuidv4(),
      alumnoId: nota.getAlumnoId(),
      grado: nota.getGrado(),
      seccion: nota.getSeccion(),
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
      prediccion: nota.getPrediccion(),
      comentario: nota.getComentario(),
      fechaPrediccion: nota.getFechaPrediccion().toISOString()
    };

    await this.tableClient.insert(notaEntity);

    return new Nota(
      notaEntity.alumnoId,
      notaEntity.grado,
      notaEntity.seccion,
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
      notaEntity.comentario,
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
        notaEntity.grado,
        notaEntity.seccion,
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
        notaEntity.comentario,
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
        notaEntity.grado,
        notaEntity.seccion,
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
        notaEntity.comentario,
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

      if (query.grado) {
        filter += ` and grado eq ${query.grado}`;
      }

      if (query.seccion) {
        filter += ` and seccion eq '${query.seccion}'`;
      }

      const result = await this.tableClient.query<NotaEntity>(filter);
      
      if (!result || result.length === 0) {
        return [];
      }

      return result.map(notaEntity => new Nota(
        notaEntity.alumnoId,
        notaEntity.grado,
        notaEntity.seccion,
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
        notaEntity.comentario,
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
        rowKey: this.generateRowKey(nota.getTipoPeriodo(), nota.getValorPeriodo(), nota.getGrado(), nota.getSeccion()),
        id: nota.getId(),
        alumnoId: nota.getAlumnoId(),
        grado: nota.getGrado(),
        seccion: nota.getSeccion(),
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
        prediccion: nota.getPrediccion(),
        comentario: nota.getComentario(),
        fechaPrediccion: nota.getFechaPrediccion().toISOString()
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
        rowKey: this.generateRowKey(nota.getTipoPeriodo(), nota.getValorPeriodo(), nota.getGrado(), nota.getSeccion()),
        id: nota.getId(),
        alumnoId: nota.getAlumnoId(),
        grado: nota.getGrado(),
        seccion: nota.getSeccion(),
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
        prediccion: nota.getPrediccion(),
        comentario: nota.getComentario(),
        fechaPrediccion: null
      };

      await this.tableClient.delete(notaEntity);
    } catch (error) {
      throw new Error("Error al eliminar la nota");
    }
  }
} 