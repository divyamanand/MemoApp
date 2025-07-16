import { useAppDispatch, useAppSelector} from './app/hooks'
import Register from './components/Register'
import {useGetUserDetailsQuery, useUpdateAccessTokenQuery } from './service/auth'
import { logoutUser } from './features/auth/authActions'
import Login from './components/Login'
import { useEffect } from 'react'
import { setCredentials } from './features/auth/authSlice'
import QuestionsList from './components/QuestionsList'
import RevisionsList from './components/RevisionsList'

export default function App() {
  const dispatch = useAppDispatch()
  const {revisions} = useAppSelector(state => state.questions)
  
  const { error, isSuccess } = useUpdateAccessTokenQuery(undefined,  {
    pollingInterval: 15*60*1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const {data, error : userError, isSuccess: userSuccess} = useGetUserDetailsQuery(undefined, 
    {skip : !isSuccess, }
  )

  useEffect(() => {
    if (isSuccess && data && userSuccess) dispatch(setCredentials(data))
    if (error || userError) dispatch(logoutUser())
  }, [isSuccess, error, userError, data, userSuccess, dispatch])

  // console.log(storedQuestions)
  console.log(revisions)

  return (
    <div>
      <div>
        <Register/>
        <Login/>
        <button onClick={() => dispatch(logoutUser())}>Logout</button>
        <QuestionsList/>
        <RevisionsList/>
      </div>
    </div>
  )
}