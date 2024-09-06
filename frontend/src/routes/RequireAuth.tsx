import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import routes from './routes';

const RequireAuth = (): JSX.Element => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={routes.LOGIN_PAGE} replace />
  );
};

export default RequireAuth;
