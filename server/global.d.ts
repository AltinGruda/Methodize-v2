declare interface Error {
  name: string
  message: string
  statusCode: number
  data: unknown[]
  stack?: string
  code?: number | string
}