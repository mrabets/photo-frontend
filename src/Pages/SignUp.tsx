import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function SignUp() {
  const { 
    register, 
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onBlur"
  });
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('') 
  const [api_errors, setApiErrors] = useState('');

  const onSubmit = () => {
    axios
      .post(process.env.REACT_APP_API_URL + '/users/', {
        user: {
          email,
          password,
          password_confirmation
        },
      })
      .then(response => response.data)
      .then(data => {
        dispatch(setUser({
          id: data.user.id,
          email: data.user.email,
          token: data.token
        }))
        navigate('/', {replace: true})
      })
      .catch(error => setApiErrors(error.response.data.error))
  }

  return (
    <div className="Own-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="Error-label">
          {api_errors}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            {...register("email", {
              required: true,
            })}
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="form-control"
          />
          <div className="Error-label">
            {errors?.email?.type === "required" && <p>Email is required</p>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            {...register("password", {
              required: true,
            })}
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="form-control"
          />
          <div className="Error-label">
            {errors?.password?.type === "required" && <p>Password is required</p>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password confirmation</label>
          <input
            type="password"
            name="password_confirmation"
            value={password_confirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            className="form-control"
          />
        </div>

        <input type="submit" className="btn btn-primary" />
      </form>
    </div>
  );
}