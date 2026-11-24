export interface CrudPageStudent {
  id: string
  name: string
  username: string
  phone: string
  status: 'Active' | 'Inactive'
  registeredAt: string
}

export const useCrudPageDemo = () => {
  const students = useState<CrudPageStudent[]>('crud-page-demo-students', () => [
    { id: 'demo-1', name: 'Alex Morgan', username: 'alex.morgan', phone: '0812-0000-0001', status: 'Active', registeredAt: '2026-01-12' },
    { id: 'demo-2', name: 'Sam Taylor', username: 'sam.taylor', phone: '0812-0000-0002', status: 'Inactive', registeredAt: '2026-02-08' },
    { id: 'demo-3', name: 'Jordan Lee', username: 'jordan.lee', phone: '0812-0000-0003', status: 'Active', registeredAt: '2026-03-18' },
  ])

  return { students }
}
