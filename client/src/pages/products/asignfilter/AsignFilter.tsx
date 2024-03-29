import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GrFilter } from 'react-icons/gr';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Star from 'src/components/star';
import path from 'src/constants/path';
import { Brand } from 'src/types/brand.type';
import { ProductListConfig } from 'src/types/product.type';
import { type FilterPriceSchema, filterPriceSchema } from 'src/utils/rulesValidateForm';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface Props {
  queryConfig: {
    [key in keyof ProductListConfig]: string;
  };
  brands: Brand[];
}

function AsignFilter({ queryConfig, brands }: Props) {
  const { t } = useTranslation('asignfilter');
  const [isLoadMoreBrand, setIsLoadMoreBrand] = useState<{
    isLoadMore: boolean;
    lengthBrands: number;
  }>({
    isLoadMore: false,
    lengthBrands: 5,
  });
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FilterPriceSchema>({
    resolver: yupResolver(filterPriceSchema),
  });
  const onSubmit = handleSubmit((data) => {
    if (Number(data.minPrice) > Number(data.maxPrice) || Number(data.maxPrice) < Number(data.minPrice)) {
      toast.error('Giá min max không hợp lệ');
      return;
    } else {
      if (data.maxPrice && data.maxPrice) {
        navigate({
          pathname: path.home,
          search: createSearchParams({
            ...queryConfig,
            price_min: data.minPrice as string,
            price_max: data.maxPrice as string,
          }).toString(),
        });
      }
      reset();
    }
  });
  return (
    <div className='p-4'>
      <div className='flex items-center border-b border-b-green-600'>
        <GrFilter />
        <span className='ml-2 font-bold'>{t('asignfilter.search filters')}</span>
      </div>
      <div className='mt-2'>
        <p className='text-base text-black'>{t('asignfilter.producer')}</p>
        <ul>
          {brands.length >= 0 &&
            brands.map((brand, index) => {
              if (index < isLoadMoreBrand.lengthBrands)
                return (
                  <li
                    key={brand.id}
                    className={classNames(
                      'cursor-pointer p-2 text-sm text-gray-700 duration-200 hover:text-orange-500',
                      {
                        'text-orange-500': String(brand.id) === queryConfig.brandId,
                      }
                    )}
                  >
                    <Link
                      to={{
                        pathname: path.home,
                        search: createSearchParams({ ...queryConfig, brandId: brand.id.toString() }).toString(),
                      }}
                    >
                      {brand.name}
                    </Link>
                  </li>
                );
            })}
        </ul>
        {brands.length > 5 && !isLoadMoreBrand.isLoadMore && (
          <button
            onClick={() => {
              setIsLoadMoreBrand({
                isLoadMore: true,
                lengthBrands: brands.length,
              });
            }}
            className='flex w-full cursor-pointer items-center justify-center p-2 text-gray-700 duration-200'
          >
            <span className='text-base'>Mở rộng</span>
            <span className='ml-1 flex items-center justify-center'>
              <FaAngleDown color='#374151' size={20} />
            </span>
          </button>
        )}
        {brands.length > 5 && isLoadMoreBrand.isLoadMore && (
          <button
            onClick={() => {
              setIsLoadMoreBrand({
                isLoadMore: false,
                lengthBrands: 5,
              });
            }}
            className='flex w-full cursor-pointer items-center justify-center p-2 text-gray-700 duration-200'
          >
            <span className='text-base'>Thu gọn</span>
            <span className='ml-1 flex items-center justify-center'>
              <FaAngleUp color='#374151' size={20} />
            </span>
          </button>
        )}
      </div>
      <hr />
      <div className='mt-2'>
        <p className='text-base text-black'>{t('asignfilter.price')}</p>
        <form className='mt-2 flex flex-col' noValidate onSubmit={onSubmit}>
          <div className='flex items-center justify-around'>
            <input
              type='text'
              placeholder={t('asignfilter.from') || 'from'}
              {...register('minPrice')}
              className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-xs'
            />
            <span className='mx-1 h-0.5 w-[20%] bg-slate-600'></span>
            <input
              type='text'
              placeholder={t('asignfilter.to') || 'to'}
              {...register('maxPrice')}
              className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-xs'
            />
          </div>
          <button
            type='submit'
            className='mr-2 mb-2 mt-4 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '
          >
            {t('asignfilter.apply')}
          </button>
        </form>
      </div>
      <hr />
      <div className='mt-2'>
        <p className='text-base text-black'>{t('asignfilter.rating')}</p>
        <div>
          {Array(5)
            .fill(0)
            .map((_, i) => {
              return (
                <div
                  className='flex cursor-pointer items-center rounded-sm p-0.5 text-yellow-300 hover:bg-gray-300'
                  key={i}
                >
                  {i === 0 && (
                    <Link
                      className='w-full'
                      to={{
                        pathname: path.home,
                        search: createSearchParams({ ...queryConfig, rate: '5' }).toString(),
                      }}
                    >
                      <Star ratings={5} />
                    </Link>
                  )}
                  {i === 1 && (
                    <Link
                      className='w-full'
                      to={{
                        pathname: path.home,
                        search: createSearchParams({ ...queryConfig, rate: '4' }).toString(),
                      }}
                    >
                      <Star ratings={4} />
                    </Link>
                  )}
                  {i === 2 && (
                    <Link
                      className='w-full'
                      to={{
                        pathname: path.home,
                        search: createSearchParams({ ...queryConfig, rate: '3' }).toString(),
                      }}
                    >
                      <Star ratings={3} />
                    </Link>
                  )}
                  {i === 3 && (
                    <Link
                      className='w-full'
                      to={{
                        pathname: path.home,
                        search: createSearchParams({ ...queryConfig, rate: '2' }).toString(),
                      }}
                    >
                      <Star ratings={2} />
                    </Link>
                  )}
                  {i === 4 && (
                    <Link
                      className='w-full'
                      to={{
                        pathname: path.home,
                        search: createSearchParams({ ...queryConfig, rate: '1' }).toString(),
                      }}
                    >
                      <Star ratings={1} />
                    </Link>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <Link
        className='mr-2 mt-4 block w-full rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 duration-300 hover:bg-blue-800 hover:text-white focus:outline-none'
        to={{
          pathname: path.home,
          search: createSearchParams({
            page: queryConfig.page as string,
            limit: queryConfig.limit as string,
          }).toString(),
        }}
      >
        {t('asignfilter.clear filters')}
      </Link>
    </div>
  );
}
export default AsignFilter;
