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
  date: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ResponseQuestion = {
  _id: string;
  userId: string;
  questionName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  formData?: any;
  upcomingRevisions: Revision[];
  revisionHistory?: Revision[];
  createdAt?: Date;
  updatedAt?: Date;
  isPending: boolean;
};

export type PostQuestion = {
  _id: string;
  userId: string;
  questionName: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
    totalQuestions: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  questions: T[];
};

export type PaginatedApiResponse<T> = ApiResponse<PaginatedQuestionsData<T>>;
