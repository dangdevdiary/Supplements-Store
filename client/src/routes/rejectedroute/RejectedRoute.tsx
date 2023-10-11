import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from 'src/store';

function RejectedRoute() {
  const isAuth = useSelector((state: RootState) => state.authReducer.isAuth);
  return !isAuth ? <Outlet /> : <Navigate to='/' />;
}
export default RejectedRoute;
