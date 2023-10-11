import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from 'src/store';

function ProtectedRoute() {
  const isAuth = useSelector((state: RootState) => state.authReducer.isAuth);
  return isAuth ? <Outlet /> : <Navigate to='/login' />;
}
export default ProtectedRoute;
