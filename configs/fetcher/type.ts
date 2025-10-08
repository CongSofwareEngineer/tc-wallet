export type IFetch = {
  url: string
  baseUrl?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Record<string, any>
  body?: any
  formData?: any
  auth?: string | boolean
  throwError?: boolean
  showError?: boolean
} & Partial<RequestInit>

export type ReturnData<T> = {
  statusCode: number
  data: T | null
  message: string
  result: T
}

export type GetListResult<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PaginationQuery = {
  limit: number
  page: number
}
