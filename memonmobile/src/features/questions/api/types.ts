import { EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  ApiResponse,
  PaginatedApiResponse,
  ResponseQuestion,
} from '../../../constants/types';
import { axiosBaseQuery } from '../../axiosQuery';

export type InitialPageParam = {
  page: number;
  pageSize: number;
};

export type {
  ApiResponse,
  PaginatedApiResponse,
  ResponseQuestion,
};

export type MyBaseQuery = ReturnType<typeof axiosBaseQuery>;
export type TagUnion = 'Questions' | 'Revisions';
export type MyBuilder = EndpointBuilder<any, TagUnion, 'questionApi'>;
