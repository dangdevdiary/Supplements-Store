/* eslint-disable react/jsx-key */
import { useMultiStepForm } from 'src/hooks/useMultiStepForm';
import EmailForm from './EmailForm';
import NewPassword from './NewPassword';
import OtpForm from './OtpForm';
import { FormEvent, useState } from 'react';
import userApi from 'src/apis/user.api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { isAxiosErr } from 'src/utils/error';
import { useNavigate } from 'react-router-dom';
export type TForgotPassword = {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  otp: string[];
  tokenId: string;
};
function ForgotPassword() {
  const navigate = useNavigate();
  const [data, setData] = useState<TForgotPassword>({
    email: '',
    newPassword: '',
    confirmNewPassword: '',
    otp: ['', '', '', '', '', ''],
    tokenId: '',
  });
  const updateFields = (fields: Partial<TForgotPassword>) => {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  };
  const { steps, currentStepIndex, step, isFirstStep, next, back, isLastStep } = useMultiStepForm([
    <EmailForm {...data} updateFields={updateFields} />,
    <NewPassword {...data} updateFields={updateFields} />,
    <OtpForm {...data} updateFields={updateFields} />,
  ]);

  const checkEmailExist = useMutation({
    mutationFn: (email: string) => userApi.forgotPassword(email),
  });

  const resetPassword = useMutation({
    mutationFn: (body: Omit<TForgotPassword, 'confirmNewPassword' | 'otp'> & { otp: string }) =>
      userApi.resetPassword(body),
  });
  const handleOnsubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFirstStep) {
      checkEmailExist.mutate(data.email, {
        onSuccess: (data) => {
          if (data.data.data.tokenId) {
            setData((prev) => {
              return { ...prev, tokenId: data.data.data.tokenId };
            });
            next();
          }
        },
        onError: (err) => {
          if (isAxiosErr<{ error: string }>(err)) {
            toast.error(err.response?.data.error, { autoClose: 1000 });
            return;
          }
        },
      });
      console.log(resetPassword.isLoading);
    }
    if (!isFirstStep && !isLastStep) {
      if (currentStepIndex === 1 && data.confirmNewPassword !== data.newPassword) {
        toast.error('confirm password must be same with new password', { autoClose: 1000 });
        return;
      }
      next();
    }
    if (isLastStep) {
      const otp = data.otp.join('');
      const body: Omit<TForgotPassword, 'confirmNewPassword' | 'otp'> & { otp: string } = {
        email: data.email,
        newPassword: data.newPassword,
        otp,
        tokenId: data.tokenId,
      };
      resetPassword.mutate(body, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          navigate('/login');
          setData({
            email: '',
            newPassword: '',
            confirmNewPassword: '',
            otp: ['', '', '', '', '', ''],
            tokenId: '',
          });
        },
        onError: (err) => {
          if (isAxiosErr<{ error: string }>(err)) {
            toast.error(err.response?.data.error, { autoClose: 1000 });
            return;
          }
        },
      });
    }
  };
  return (
    <div className='mx-auto grid max-w-7xl place-items-center p-2'>
      <div className='relative w-1/2 rounded-lg bg-white p-8'>
        <h2 className='text-center text-2xl font-semibold text-orange-500'>Forgot Password</h2>
        <form onSubmit={handleOnsubmit}>
          <span className='absolute top-2 right-4'>
            {currentStepIndex + 1} / {steps.length}
          </span>
          {step}
          <div className='mt-1 flex justify-end gap-2'>
            {!isFirstStep && (
              <button
                onClick={back}
                type='button'
                className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
              >
                Back
              </button>
            )}
            {checkEmailExist.isLoading ? (
              <button
                disabled={checkEmailExist.isLoading}
                type='submit'
                className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
              >
                <div role='status'>
                  <svg
                    aria-hidden='true'
                    className='mr-2 inline h-8 w-8 animate-spin fill-yellow-400 text-gray-200 dark:text-gray-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                  <span className='sr-only'>Loading...</span>
                </div>
              </button>
            ) : (
              <button type='submit' className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'>
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
