import { useEffect} from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useGetAllQuestionsQuery } from "../service/questions"
import { deleteAllQuestions, setQuestions } from "../features/questions/questionSlice"
import Error from "./Error"
import QuestionCard from "./QuestionCard"
import { useNetworkState } from "@uidotdev/usehooks"


const QuestionsList = () => {
  const { success, userInfo } = useAppSelector(state => state.auth);
  const {questions: storedQuestions} = useAppSelector(state => state.questions)
  const dispatch = useAppDispatch();
  const { online } = useNetworkState()

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
      dispatch(setQuestions(questions));
    }

    if (!success && !userInfo) {
      dispatch(deleteAllQuestions());
    }
  }, [dispatch, questions, isSuccess, success, userInfo]);


  if (questionsError && !storedQuestions) {
    return (
      <Error
        errorMessage="Something went wrong"
        statusCode={501}
      />
    );
  }

  return (
    <>
        {storedQuestions && storedQuestions.questions?.map(ques => (
            <div key={ques._id}>
                <QuestionCard question={ques}/>
            </div>
        ))}
    </>
  );
};

export default QuestionsList;
