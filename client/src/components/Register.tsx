import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useForm } from 'react-hook-form'
import { registerUser } from '../features/auth/authActions'

const Register = () => {
  const { loading, userInfo, error, success } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    if (userInfo) console.log(userInfo)
    if (success) {
      console.log("Registration successful")
    }
  }, [userInfo, success])

  const submitForm = (data: any) => {
    if (data.password !== data.confirmPassword) {
      alert("Password mismatch")
      return
    }

    data.email = data.email.toLowerCase()
    dispatch(registerUser(data))
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <p>error</p>}
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          className='form-input'
          {...register('name')}
          required
        />
      </div>
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
      <div className='form-group'>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          type='password'
          className='form-input'
          {...register('confirmPassword')}
          required
        />
      </div>
      <button type='submit' className='button' disabled={loading}>
        {loading ? "loading" : 'Register'}
      </button>
    </form>
  )
}

export default Register
