export interface ITerm {
  text: string
  role_id: number
  active: boolean
  begin_date: Date
  end_date: Date | null
  dividedText?: string[]
}
