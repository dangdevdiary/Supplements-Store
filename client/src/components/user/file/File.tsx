import Modal from 'src/components/modal';
import { FormEvent, useMemo, useState } from 'react';
import { User } from 'src/types/user.type';
import {
  useMutation,
  type QueryObserverResult,
  type RefetchOptions,
  type RefetchQueryFilters,
} from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { FaFolderOpen } from 'react-icons/fa';
import userApi from 'src/apis/user.api';
import { toast } from 'react-toastify';

interface Props {
  user?: User;
  refetchAddress: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<User, any>, unknown>>;
}
function File({ user, refetchAddress }: Props) {
  const { t } = useTranslation('file');
  const [avatar, setAvatar] = useState<File>();
  const userMemo = useMemo(() => {
    if (user) {
      return user;
    }
  }, [user]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleUpdateUser = () => {
    setShowModal(!showModal);
  };
  const updateAvatarMutation = useMutation({
    mutationFn: (data: FormData) => userApi.updateAvatar(data, user?.id || 0),
  });
  const handleUpdateAvatar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    if (avatar) {
      data.append('image', avatar);
      updateAvatarMutation.mutate(data, {
        onSuccess: () => {
          refetchAddress();
        },
      });
    } else {
      toast.error('Please add avatar then try again');
    }
  };
  return (
    <div className='w-full p-2'>
      <div className='grid grid-cols-12'>
        <div className='col-span-12 md:col-span-8'>
          <div className='border-b p-2'>
            <h2 className='text-xl font-semibold'>{t('file.my profile')}</h2>
            <p className='text-base'>{t('file.manage your profile information')}</p>
          </div>
          <div className='mt-2 min-h-[200px] w-full lg:min-h-[200px]'>
            <div className='mx-auto grid w-full grid-cols-8 lg:min-w-[700px]'>
              <div className='col-span-3 grid min-h-[8rem] grid-cols-1 p-2 lg:col-span-2'>
                <span className='text-left text-lg text-slate-300'>Email:</span>
                <span className='text-left text-lg text-slate-300 '>{t('file.first and last name')}:</span>
                <span className='text-left text-lg text-slate-300 '>{t('file.phone number')}:</span>
              </div>
              <div className='col-span-4 grid min-h-[8rem] grid-cols-1 p-2 lg:col-span-6'>
                <span className='text-lg'> {user?.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2')}</span>
                <span className='text-lg'>{`${user?.firstName} ${user?.lastName}`}</span>
                <div className='text-lg'>
                  {user?.phone || <i className='text-blue-400'>{t('file.the phone number has not been updated')}</i>}
                </div>
              </div>
              <div className='col-span-7 flex h-[5rem] items-center justify-center'>
                <button
                  onClick={handleUpdateUser}
                  type='button'
                  className='max-h-[3rem] rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-2 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none'
                >
                  {t('file.update profile')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-4'>
          <div className='flex items-center justify-center p-4'>
            <img
              className='max-h-60'
              src={
                userMemo?.avatar.imageUrl
                  ? `http://127.0.0.1:3000/${userMemo.avatar.imageUrl}`
                  : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D'
              }
              alt=''
            />
          </div>
          <div className='bg-white px-2'>
            <form onSubmit={handleUpdateAvatar}>
              <div className='mx-auto max-w-md overflow-hidden rounded-lg md:max-w-xl'>
                <div className='md:flex'>
                  <div className='w-full p-3'>
                    <div className='relative flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-blue-700 bg-gray-100'>
                      <div className='absolute'>
                        <div className='flex flex-col items-center'>
                          <FaFolderOpen size={26} color='blue' />
                          <span className='block font-normal text-gray-400'>
                            {avatar?.name ? avatar.name : 'Upload your avatar'}
                          </span>
                        </div>
                      </div>

                      <input
                        type='file'
                        onChange={(e) => {
                          const image = e.target.files;
                          if (image?.length) {
                            setAvatar(image[0]);
                          }
                        }}
                        className='h-full w-full opacity-0'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <button type='submit' className='rounded-md bg-teal-400 px-4 py-2 text-white hover:bg-cyan-400'>
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showModal && <Modal refetchAddress={refetchAddress} infoData={userMemo} setShowModal={setShowModal}></Modal>}
    </div>
  );
}
export default File;
