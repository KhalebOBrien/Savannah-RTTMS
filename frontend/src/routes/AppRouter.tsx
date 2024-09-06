import { Navigate, Route, Routes } from 'react-router-dom';

import routes from './routes';
import RequireAuth from './RequireAuth';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TaskList from '../pages/TaskList';
// import HomePage from 'pages/home/HomePage';
import PageNotFound from '../pages/PageNotFound';

const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route
        path={routes.INDEX_PAGE}
        element={<Navigate to={routes.TASKS_PAGE} replace />}
      />
      <Route path={routes.REGISTER_PAGE} element={<Register />} />
      <Route path={routes.LOGIN_PAGE} element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route path={routes.TASKS_PAGE} element={<TaskList />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRouter;
