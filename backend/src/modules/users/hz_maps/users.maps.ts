export const ApprovedBy = new Map<string, string[]>()
ApprovedBy.set('estudante', [
  'secretaria',
  'direção',
  'administrador',
  'ministerial'
])
ApprovedBy.set('docente', ['secretaria', 'direção', 'administrador'])
ApprovedBy.set('secretaria', ['direção', 'administrador'])
ApprovedBy.set('direção', ['direção', 'administrador'])
ApprovedBy.set('representante de campo', ['direção', 'administrador'])
ApprovedBy.set('administrador', ['administrador'])
ApprovedBy.set('ministerial', ['direção', 'administrador'])
ApprovedBy.set('design', [
  'secretaria',
  'direção',
  'administrador',
  'ministerial'
])

export const CanApprove = new Map<string, string[]>()

CanApprove.set('secretaria', ['estudante', 'docente', 'design'])
CanApprove.set('direção', [
  'estudante',
  'docente',
  'secretaria',
  'direção',
  'representante de campo',
  'ministerial',
  'design'
])
CanApprove.set('administrador', [
  'estudante',
  'docente',
  'secretaria',
  'direção',
  'representante de campo',
  'ministerial',
  'design',
  'administrador'
])
CanApprove.set('ministerial', ['estudante', 'design'])
CanApprove.set('estudante', [])
CanApprove.set('docente', [])
CanApprove.set('representante de campo', [])

export enum RolesWeights {
  'estudante' = 0,
  'design' = 1,
  'docente' = 2,
  'representante de campo' = 3,
  'secretaria' = 4,
  'ministerial' = 5,
  'direção' = 6,
  'administrador' = 7
}
