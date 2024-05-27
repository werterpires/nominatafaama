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
