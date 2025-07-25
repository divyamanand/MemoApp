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
  statusCode?: number | null;
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
  createdAt: Date;
  updatedAt: Date;
};

export type ResponseQuestion = {
  _id: string;
  userId: string;
  questionName: string;
  difficulty: string;
  tags?: string[];
  formData?: any,
  upcomingRevisions: Revision[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type PostQuestion = {
  _id: string;
  userId: string;
  questionName: string;
  difficulty: string;
  tags?: string[];
  revisions?: Revision[];
  formData?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
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
