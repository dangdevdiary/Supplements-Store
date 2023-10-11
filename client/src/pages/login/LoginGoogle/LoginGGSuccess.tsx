import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import authApi from 'src/apis/auth.api';
import { saveAccessToken, saveRefreshToken } from 'src/utils/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuth } from 'src/slices/auth.slice';
import { reset } from 'src/slices/user.slice';

function LoginGGSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginGG = useMutation({
    mutationFn: () => authApi.loginSuccessGG(),
    retry: 1,
    onSuccess: (data) => {
      if (data.data.token && data.data.refreshToken) {
        dispatch(setIsAuth(true));
        saveAccessToken(data.data.token);
        saveRefreshToken(data.data.refreshToken);
        dispatch(reset());
        toast.success('welcom to WheyStore');
        navigate('/');
      }
    },
  });
  const handleLoginGG = () => {
    loginGG.mutate();
  };
  return (
    <div className='mt-4'>
      <section className='bg-white dark:bg-gray-900 '>
        <div className='mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:gap-12'>
          <div className='wf-ull lg:w-1/2'>
            <p className='text-sm font-medium text-blue-500 dark:text-blue-400'>WheyStore</p>
            <h1 className='mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl'>
              You have successfully logged in with your Google account
            </h1>
            <p className='mt-4 text-gray-500 dark:text-gray-400'>Please click the button below to go to WheyStore</p>
            <div className='mt-6 flex items-center gap-x-3'>
              <button
                onClick={handleLoginGG}
                className='w-1/2 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto'
              >
                Go to WheyStore
              </button>
            </div>
          </div>
          <div className='relative mt-12 w-full lg:mt-0 lg:w-1/2'>
            <img
              alt='img'
              className='w-full max-w-lg lg:mx-auto'
              src='https://media.istockphoto.com/id/1010491174/vector/welcome-paper-poster-with-colorful-brush-strokes.jpg?s=612x612&w=0&k=20&c=vWHxR6O7yNj68RfGt5449Ww7eEkCJpYm4CWitqFzUwk='
            />
          </div>
        </div>
      </section>
      ;
    </div>
  );
}

export default LoginGGSuccess;
