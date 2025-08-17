import { HeatMap } from '@/src/constants/types';
import {
  MyBuilder,
} from '../types';

export const getHeatmapEndpoint = (build: MyBuilder) =>
    build.query<HeatMap, {from: string, to: string}>({
        query: ({from, to}) => ({
            url: `/api/v1/question/heatmap?from=${from}&to=${to} `,
            method: "GET",
        }),

        transformResponse : (res) => res.data,
    })