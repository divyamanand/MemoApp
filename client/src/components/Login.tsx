import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useEffect } from "react"
import { loginUser } from "../features/auth/authActions"

const Login = () => {
  const { loading, userInfo, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    if (userInfo) {
      console.log("User logged in:", userInfo)
    }
  }, [userInfo])

  const submitForm = (data: any) => {
    dispatch(loginUser(data))
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <p>{error}</p>}
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          className='form-input'
          {...register('email')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          className='form-input'
          {...register('password')}
          required
        />
      </div>
      <button type='submit' className='button' disabled={loading}>
        {loading ? "Loading" : "Login"}
      </button>
    </form>
  )
}

export default Login
