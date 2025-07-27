import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { ApiResponse} from "../types";
import { questionApi } from "../questionApi";


export const updateQuestionEndPoint = (build: EndpointBuilder<any, "Questions", "questionApi">) => 
    build.mutation<ApiResponse, {_id: string, data: object}>({
        query: (body) => ({
            url: `api/v1/question/update-question/${body._id}`,
            method: "PATCH",
            body: body.data
        }),

        async onQueryStarted({_id, data}, {dispatch, queryFulfilled}) {
            const patchResult = dispatch(
                questionApi.util.updateQueryData("getQuestions", undefined , (draft) => {
                    draft.pages?.forEach((page) => {
                        page.data?.questions.forEach((q) => {
                            if (q._id === _id) {
                                Object.assign(q, data)
                            }
                        })
                    })
                })
            )

            try {
                await queryFulfilled
            } catch {
                patchResult.undo()
            }
        },
        
        invalidatesTags: (result, error, { _id }) => [{ type: "Questions", id: _id }],
    })