import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import LayoutWrapper from '../components/Layout';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import routes from '../routes/routes';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.TASKS_PAGE);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await dispatch(
        register({ username, email, password }),
      ).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LayoutWrapper>
      <div className="grid place-content-center h-screen">
        <div className="text-center mb-2">
          <h1 className="text-3xl mb-4 font-bold ">Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="max-w-xl border border-lightBlack p-12 rounded-2xl">
            <InputBox
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputBox
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputBox
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputBox
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-between mt-6 items-center relative">
              <Link to={routes.LOGIN_PAGE}>Login</Link>
              <div className="space-x-4">
                <Button
                  text="Register"
                  type="submit"
                  classes="text-lightBlack px-7 py-4"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </LayoutWrapper>
  );
};

export default Register;
