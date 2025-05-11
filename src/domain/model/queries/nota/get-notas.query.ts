import { TipoPeriodo } from "../../enums/periodo.enum";

export interface GetNotasQuery {
  readonly alumnoId: string;
  readonly tipoPeriodo?: TipoPeriodo;
  readonly valorPeriodo?: number;
  readonly anio?: number;
} 