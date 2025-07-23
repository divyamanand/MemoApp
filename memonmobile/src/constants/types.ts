export type RootStackParamList = {
  Dashboard: undefined
  Profile: undefined
  Settings: undefined
  Login: undefined
  Revision: undefined
  Question: undefined
  About: undefined
  Help: undefined
}

export type ErrorResponse = {
  statusCode?: number
  message: string
  errors?: any[]
  data?: null
  success: boolean
  stack?: string
}

export type ApiResponse<T = any> = {
  statusCode? : number,
  data?: T,
  message?: string,
  success?: boolean
}
