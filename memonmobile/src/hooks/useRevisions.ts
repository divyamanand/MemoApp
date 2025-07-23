import { useEffect, useState } from 'react'
import { resetUser } from '../features/auth/authSlice'
import { useGetTodaysRevisionsInfiniteQuery } from '../service/questions'
import { useAppDispatch } from '../store/hooks'
import * as SecureStore from 'expo-secure-store'
import { setRevisions } from '../features/questions/questionSlice'
import { ErrorResponse } from '../constants/types'
import { handleError } from '../service/errorService'

export const useRevisions = () => {
  const { data: revisions, error } = useGetTodaysRevisionsInfiniteQuery(1)
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<'fetched' | 'loggedOut' | 'fetching' | 'serverError'>(
    'fetching'
  )
  const [formattedError, setFormattedError] = useState<ErrorResponse>({
    message: '',
    success: false,
    statusCode: undefined,
    errors: [],
    data: null,
    stack: undefined,
  })

  useEffect(() => {
    const handleRevisionsData = async () => {
      if (error) {
        setFormattedError(handleError(error))
        if (formattedError?.statusCode === 401) {
          dispatch(resetUser())
          await SecureStore.deleteItemAsync('accessToken')
          await SecureStore.deleteItemAsync('refreshToken')
          setStatus('loggedOut')
        } else if (formattedError?.statusCode === 500) {
          setStatus('serverError')
        }
      } else if (revisions?.questions) {
        const date = new Date()
        const lastFetched = new Intl.DateTimeFormat('en-IN').format(date)
        dispatch(setRevisions({ questions: revisions.questions, lastFetched }))
        setStatus('fetched')
      }
    }
    handleRevisionsData()
  }, [revisions, error, dispatch])

  return status
}
