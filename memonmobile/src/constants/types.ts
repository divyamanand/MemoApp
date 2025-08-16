// src/constants/types.ts
export type RootStackParamList = {
  // Bottom tabs (entry points)
  Dashboard: undefined;
  Practice: undefined;
  Question: undefined;
  Profile: undefined;

  Suggestions: undefined;
  Test: undefined;
  Roadmap: undefined;
  Timeline: undefined;

  Questions: undefined;            
  AddQuestion: undefined;       
  EditQuestion: { id: string } | undefined;
  GenerateQuestion: { id?: string } | undefined;

  Settings: undefined;
  Help: undefined;

  Login: { email?: string; password?: string } | undefined;
  Register: undefined;
  Revision: undefined;
  About: undefined;
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
  description?: string;
  options?: string[];
  link?: string;
  createdAt: Date;
  updatedAt: Date;
  isPending?: boolean;
  completedCount?: number;
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
