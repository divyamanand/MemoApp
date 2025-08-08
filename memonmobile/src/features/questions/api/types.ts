import { EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  ApiResponse,
  PaginatedApiResponse,
  PostQuestion,
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
  PostQuestion,
  ResponseQuestion,
};


export type MyBaseQuery = ReturnType<typeof axiosBaseQuery>;
export type TagUnion = 'Questions' | 'Revisions';
export type MyBuilder = EndpointBuilder<any, TagUnion, 'questionApi'>;
