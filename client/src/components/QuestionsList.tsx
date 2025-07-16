import { useEffect, useState} from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useGetAllQuestionsQuery } from "../service/questions"
import { deleteAllQuestions, setAllQuestions } from "../features/questions/questionSlice"
import Error from "./Error"
import QuestionCard from "./QuestionCard"
import { useNetworkState } from "@uidotdev/usehooks"


const QuestionsList = () => {
  const { success, userInfo } = useAppSelector(state => state.auth);
  const {allQuestions, revisionQuestions} = useAppSelector(state => state.questions)
  const dispatch = useAppDispatch();
  const { online } = useNetworkState()
  const [filter, setFilter] = useState(0)

  const {
    data: questions,
    isSuccess,
    error: questionsError
  } = useGetAllQuestionsQuery(undefined, {
    skip: !success || !userInfo || !online,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  });

  useEffect(() => {
    if (questions && isSuccess && userInfo && success) {
      dispatch(setAllQuestions(questions.data));
    }

    if (!success && !userInfo) {
      dispatch(deleteAllQuestions());
    }
  }, [dispatch, questions, isSuccess, success, userInfo]);

  return (
    <>
        {filter == 0 ? revisionQuestions.questions?.map(ques => (
            <div key={ques._id}>
                <QuestionCard question={ques}/>
            </div>
        )) : allQuestions.questions?.map(ques => (
            <div key={ques._id}>
                <QuestionCard question={ques}/>
            </div>))
            }
    </>
  );
};

export default QuestionsList;
