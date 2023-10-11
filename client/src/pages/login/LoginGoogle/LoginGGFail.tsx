import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuth } from 'src/slices/auth.slice';
import { RootState } from 'src/store';
function LoginGGFail() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state: RootState) => state.authReducer.isAuth);
  return (
    <div>
      <button
        onClick={() => {
          dispatch(setIsAuth(!isAuth));
        }}
      >
        click
      </button>
      <span>{isAuth ? 'true' : 'false'}</span>
    </div>
  );
}

export default LoginGGFail;
