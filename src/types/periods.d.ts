export type PeriodState = 'Activo' | 'Pendiente' | 'Finalizado';

export type Period = {
  name: string
  code: string
  state: PeriodState
  begin: string
  end: string
}