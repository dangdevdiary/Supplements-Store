import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import productsApi from 'src/apis/product.api';
import { Product } from 'src/types/product.type';
import { SuggestProductSchema, suggestProductSchema } from 'src/utils/rulesValidateForm';

interface IBmiProps {
  handleDataFromChild: (data: Product[]) => void;
}

function BmiForm({ handleDataFromChild }: IBmiProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SuggestProductSchema>({
    resolver: yupResolver(suggestProductSchema),
  });
  const suggestProductMutation = useMutation({
    mutationFn: (suggestion: {
      weight: number;
      height: number;
      waist: number;
      neck: number;
      hip?: number;
      gender: string;
    }) => productsApi.suggestProducts(suggestion),
  });
  const onSubmit = handleSubmit((data) => {
    suggestProductMutation.mutate(data, {
      onSuccess: (data) => {
        handleDataFromChild(data.data.data);
        reset();
      },
    });
  });
  const watchFieldBmi = watch();

  return (
    <div>
      <div className='mx-auto block max-w-md rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700'>
        <h3 className='mb-4 text-center text-lg font-semibold text-green-700'>Vui lòng cung cấp thông tin</h3>
        <form onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            {/*First name input*/}
            <div className='relative mb-6 border-2'>
              <input
                type='text'
                className={classNames(
                  'peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:opacity-0 focus:placeholder:opacity-100 motion-reduce:transition-none',
                  {
                    'text-red-700 placeholder-red-300': errors.weight?.message,
                  }
                )}
                id='weightInput'
                placeholder='đơn vị KG'
                {...register('weight')}
              />
              <label
                htmlFor='weightInput'
                className={classNames(
                  '  pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate bg-white px-2 pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200',
                  {
                    '-translate-y-[0.9rem] scale-[0.8]': watchFieldBmi.weight,
                    'text-red-500': errors.weight?.message,
                  }
                )}
              >
                Cân nặng
              </label>
            </div>
            {/*Last name input*/}
            <div className='relative mb-6 border-2'>
              <input
                type='text'
                className={classNames(
                  'peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:opacity-0 focus:placeholder:opacity-100 motion-reduce:transition-none',
                  {
                    'text-red-700 placeholder-red-300': errors.height?.message,
                  }
                )}
                id='heightInput'
                placeholder='đơn vị CM'
                {...register('height')}
              />
              <label
                htmlFor='heightInput'
                className={classNames(
                  '  pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate bg-white px-2 pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200',
                  {
                    '-translate-y-[0.9rem] scale-[0.8]': watchFieldBmi.height,
                    'text-red-500': errors.height?.message,
                  }
                )}
              >
                Chiều cao
              </label>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            {/*First name input*/}
            <div className='relative mb-6 border-2'>
              <input
                type='text'
                className={classNames(
                  'peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:opacity-0 focus:placeholder:opacity-100 motion-reduce:transition-none',
                  {
                    'text-red-700 placeholder-red-300': errors.waist?.message,
                  }
                )}
                id='waistInput'
                placeholder='đơn vị CM'
                {...register('waist')}
              />
              <label
                htmlFor='waistInput'
                className={classNames(
                  '  pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate bg-white px-2 pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200',
                  {
                    '-translate-y-[0.9rem] scale-[0.8]': watchFieldBmi.waist,
                    'text-red-500': errors.waist?.message,
                  }
                )}
              >
                Vòng eo
              </label>
            </div>
            {/*Last name input*/}
            <div className='relative mb-6 border-2'>
              <input
                type='text'
                className={classNames(
                  'peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:opacity-0 focus:placeholder:opacity-100 motion-reduce:transition-none',
                  {
                    'text-red-700 placeholder-red-300': errors.neck?.message,
                  }
                )}
                id='neckInput'
                placeholder='đơn vị CM'
                {...register('neck')}
              />
              <label
                htmlFor='neckInput'
                className={classNames(
                  '  pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate bg-white px-2 pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200',
                  {
                    '-translate-y-[0.9rem] scale-[0.8]': watchFieldBmi.neck,
                    'text-red-500': errors.neck?.message,
                  }
                )}
              >
                Chu vi cổ
              </label>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/*First name input*/}
            <div className='flex items-center'>
              <h3 className='text-gray-500'>Giới tính:</h3>
              <div className='mx-2  flex items-center justify-center'>
                <input
                  id='gender-option-1'
                  type='radio'
                  value='nam'
                  {...register('gender')}
                  className='h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:bg-blue-600 dark:focus:ring-blue-600'
                  defaultChecked
                />
                <label
                  htmlFor='gender-option-1'
                  className='ml-1 block text-sm font-medium text-gray-500 dark:text-gray-300'
                >
                  Nam
                </label>
              </div>
              <div className='flex items-center justify-center'>
                <input
                  id='gender-option-2'
                  type='radio'
                  value='nu'
                  {...register('gender')}
                  className='h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:bg-blue-600 dark:focus:ring-blue-600'
                />
                <label
                  htmlFor='gender-option-2'
                  className='ml-1 block text-sm font-medium text-gray-500 dark:text-gray-300'
                >
                  Nu
                </label>
              </div>
            </div>
            {watchFieldBmi.gender === 'nu' && (
              <div className='relative border-2'>
                <input
                  type='text'
                  className={classNames(
                    'peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:opacity-0 focus:placeholder:opacity-100 motion-reduce:transition-none',
                    {
                      'text-red-700 placeholder-red-300': errors.hip?.message,
                    }
                  )}
                  id='hipInput'
                  placeholder='đơn vị CM'
                  {...register('hip')}
                />
                <label
                  htmlFor='hipInput'
                  className={classNames(
                    '  pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate bg-white px-2 pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200',
                    {
                      '-translate-y-[0.9rem] scale-[0.8]': watchFieldBmi.hip,
                      'text-red-500': errors.hip?.message,
                    }
                  )}
                >
                  Vòng mông
                </label>
              </div>
            )}
          </div>
          {/*Submit button*/}
          <div className='mt-8 flex items-center justify-center'>
            <button className=' rounded-full bg-blue-500 py-1 px-6 font-bold text-white hover:bg-blue-700'>
              Gợi ý
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BmiForm;
