import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useGetTodaysRevisionsQuery } from "../service/questions";
import {
  deleteAllQuestions,
  setAllRevisionQuestions,
  setRevisions,
} from "../features/questions/questionSlice";
import Error from "./Error";
import RevisionCard from "./RevisionCard";
import { useNetworkState } from "@uidotdev/usehooks";

const RevisionsList = () => {
  const { userInfo, success: userSuccess } = useAppSelector(
    (state) => state.auth
  );
  const { revisions: storedRevisions } = useAppSelector(
    (state) => state.questions
  );
  const dispatch = useAppDispatch();
  const {online} = useNetworkState()

  const {
    data: revisions,
    isSuccess: revisionsFetched,
    error: revisionFetchError,
  } = useGetTodaysRevisionsQuery(undefined, {
    skip: !userInfo || !userSuccess || !online,
  });

  // Store fetched revisions in Redux
  useEffect(() => {
    if (revisions && userSuccess && userInfo && revisionsFetched) {
      dispatch(setAllRevisionQuestions(revisions.data));
    }

    if (!userInfo || !userSuccess) {
      dispatch(deleteAllQuestions());
    }
  }, [revisions, userSuccess, userInfo, revisionsFetched, dispatch]);

  if (revisionFetchError) return <Error />;

  useEffect(() => {
    if (revisions?.data?.questions) {
      const cards = revisions.data.questions.map((ques) => {
        const { questionName, difficulty, tags, _id, upcomingRevisions } = ques;
        const nextRevisionId = upcomingRevisions[0]?._id
        return { questionName, difficulty, tags, _id, nextRevisionId };
      });
      dispatch(setRevisions(cards));
    }
  }, [revisions, dispatch]);

//   console.log(storedRevisions)

  return (
    <>
        {
            storedRevisions?.map(revisionCard => 
            <div key={revisionCard.nextRevisionId}>
                <RevisionCard revision={revisionCard}/>
            </div>)
        }
    </>
  )
};

export default RevisionsList;
