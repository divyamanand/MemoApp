export type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Login: undefined;
  Revision: undefined;
  Question: undefined;
  About: undefined;
  Help: undefined;
};

export type ErrorResponse = {
  statusCode?: number;
  message: string;
  errors?: any[];
  data?: null;
  success: boolean;
  stack?: string;
};

export type Revision = {
  _id: string;
  date: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  _id: string;
  userId: string;
  upcomingRevisions: Revision[];
};

export type ApiResponse<T = any> = {
  statusCode?: number;
  data: T;
  message?: string;
  success?: boolean;
};

export type PaginatedQuestionsData<T> = {
  metadata: {
    total: number;
    page: number;
    pageSize: number;
  };

  questions: T[];
};

export type PaginatedApiResponse<T> = ApiResponse<PaginatedQuestionsData<T>>;
