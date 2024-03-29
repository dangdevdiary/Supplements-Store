import { useLocation, useNavigate } from 'react-router-dom';
import BreadCrumb from '../breadcrumb';
import { useQuery } from '@tanstack/react-query';
import brandApi from 'src/apis/brand.api';
import { useEffect, useState } from 'react';
import productsApi from 'src/apis/product.api';
import { toast } from 'react-toastify';
import HelmetSale from 'src/components/Helmet';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import categoryApi from 'src/apis/category.api';

export default function ProductForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const brand = useQuery(['get_all_brands'], () => brandApi.getAllBrand(''), {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const { data: cates } = useQuery(['getAllCate'], () => categoryApi.getAllCategory());

  const [specs, setSpecs] = useState<{ key: string; value: string; id: number }[]>([]);
  const [specModal, openSpecModal] = useState(false);
  const [keySpec, setKeySpec] = useState('');
  const [specId, setIdSpec] = useState(-1);
  const [valueSpec, setValueSpec] = useState('');

  const [productData, setProductData] = useState<{
    name: string;
    brandId: number;
    image?: File;
    description: string;
    flavor: string;
    weight: string;
    price: string;
    cateId: number;
    productionDate: string;
    expirationDate: string;
  }>({
    name: '',
    brandId: -1,
    image: undefined,
    description: '',
    flavor: '',
    weight: '',
    price: '',
    cateId: -1,
    productionDate: '',
    expirationDate: '',
  });
  const [specModalType, setSpecModalType] = useState('create');
  const [refetch, _refetch] = useState(0);

  useEffect(() => {
    if (location.state.type === 'edit') {
      productsApi
        .getProductDetail(location.state.id)
        .then((res) => res.data)
        .then((data) => {
          setProductData({
            ...productData,
            name: data.name,
            brandId: data.brandId !== undefined ? data.brandId : -1,
            description: data.description,
          });
          setSpecs(data.specs);
        });
    }
  }, [refetch]);

  const createProduct = async () => {
    if (!productData.image) {
      toast.error('please select image for product');
      return;
    }
    const data = new FormData();
    data.append('name', productData.name);
    data.append('brandId', `${productData.brandId}`);
    data.append('cateId', `${productData.cateId}`);
    data.append('description', productData.description);
    data.append('flavor', productData.flavor);
    data.append('weight', productData.weight);
    data.append('expirationDate', productData.expirationDate);
    data.append('productionDate', productData.productionDate);
    data.append('price', productData.price);
    data.append('image', productData.image);
    await productsApi
      .createProduct(data)
      .then(() => {
        toast.success('Tạo sản phẩm thành công!');
      })
      .catch(() => {
        toast.error(`Lỗi không thể tạo sản phẩm`);
      });
  };

  const updateProduct = async () => {
    const response = await productsApi.updateProduct(Number(location.state.id), {
      name: productData.name,
      description: productData.description,
      brandId: productData.brandId,
    });

    if (response.status === 200) toast.success('Cập nhật sản phẩm thành công');
    else toast.error(`Cập nhật sản phẩm thất bại: ${response.statusText}`);
  };
  const { t } = useTranslation('addashboard');

  return (
    <div className='mt-4'>
      <HelmetSale
        title={`Admin Dashboard | ${location.state.type === 'create' ? 'Create Product' : 'Update Product'}`}
      ></HelmetSale>
      <BreadCrumb path={['Product', `${location.state.type === 'create' ? 'Create' : 'Update'} Product`]} />
      <div>
        <div className='mt-4 flex flex-col '>
          <div className='overflow-x-auto drop-shadow-lg'>
            <div className='inline-block w-full align-middle '>
              <div className='overflow-hidden rounded-xl border bg-white p-4'>
                <h1 className='text-lg font-semibold leading-loose'>
                  {location.state.type === 'create' ? t('detailproduct.createproduct') : t('detailproduct.updateinfo')}
                </h1>
                <div className='grid grid-cols-2 gap-4 pt-4'>
                  <div>
                    <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>{t('product.name')}</p>
                    <input
                      type='text'
                      className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                      placeholder={t('product.name')}
                      defaultValue={productData.name}
                      onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>
                      {t('detailproduct.selectbrand')}
                    </p>
                    <select
                      className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                      onChange={(e) => setProductData({ ...productData, brandId: Number(e.target.value) })}
                    >
                      <option>Thương hiệu</option>
                      {brand.data?.data.map((e: { id: number; name: string }, i) => (
                        <option key={i.toString()} value={e.id} selected={productData.brandId === e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {location.state.type === 'create' && (
                  <div className='mt-4 grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>{t('detailproduct.image')}</p>
                      <input
                        className='bg-gray-150 w-full cursor-pointer rounded-lg border border-gray-300 text-sm font-medium leading-loose text-gray-900 focus:outline-none'
                        type='file'
                        onChange={(e) => {
                          const image = e.target.files;
                          if (image?.length) {
                            setProductData({ ...productData, image: image[0] });
                          }
                        }}
                      />
                      <p className='mt-1 text-sm text-gray-500'>JPEG, PNG or JPG (MAX. 800x400px).</p>
                    </div>
                    <div>
                      <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>Lựa chọn danh mục</p>
                      <select
                        className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                        onChange={(e) => {
                          setProductData({ ...productData, cateId: Number(e.target.value) });
                        }}
                      >
                        <option>Danh mục</option>
                        {cates?.data?.data.map((e, i) => (
                          <option key={i.toString()} value={e.cateId} selected={productData.cateId === e.cateId}>
                            {e.cateName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div className='pt-4'>
                  <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>{t('product.description')}</p>
                  <textarea
                    placeholder={t('product.description')}
                    rows={4}
                    spellCheck={false}
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    defaultValue={productData.description}
                  ></textarea>
                </div>
                {location.state.type === 'create' && (
                  <>
                    <div className='grid grid-cols-2 gap-4 pt-4'>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>VỊ</p>
                        <input
                          type='text'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          placeholder='VANI'
                          onChange={(e) => setProductData({ ...productData, flavor: e.target.value })}
                        />
                      </div>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>TRỌNG LƯỢNG</p>
                        <input
                          type='text'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          placeholder='1KG'
                          onChange={(e) => setProductData({ ...productData, weight: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 pt-2'>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>Ngày sản xuất</p>
                        <input
                          type='date'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          onChange={(e) => setProductData({ ...productData, productionDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>Ngày hết hạn</p>
                        <input
                          type='date'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          onChange={(e) => setProductData({ ...productData, expirationDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal text-gray-500'>{t('detailproduct.price')}</p>
                        <input
                          type='text'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          placeholder='100000'
                          onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className='flex justify-start pt-4 pb-2'>
                  <button
                    className='mr-2 mb-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600'
                    onClick={async () => {
                      if (location.state.type === 'create') await createProduct();
                      if (location.state.type === 'edit') await updateProduct();
                    }}
                  >
                    {t('detailproduct.save')}
                  </button>
                  <button
                    className='mr-2 mb-2 rounded-lg border border-gray-300 bg-gray-700 px-5 py-2.5 text-sm font-medium text-white text-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200'
                    onClick={() => navigate('/admin/product')}
                  >
                    {t('product.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {location.state.type === 'edit' && (
            <div className='mt-4 overflow-x-auto drop-shadow-lg'>
              <div className='inline-block w-full align-middle '>
                <div className='overflow-hidden rounded-xl border bg-white p-4'>
                  <h1 className='text-lg font-semibold leading-loose'>{t('detailproduct.specifications')}</h1>
                  <div className='mt-2'>
                    <div className='grid grid-cols-6'>
                      <div className='col-span-5 rounded-md border border-gray-300'>
                        {specs.length
                          ? specs.map((e, i) => {
                              return (
                                <div
                                  className={`grid grid-cols-4 ${i % 2 == 0 ? '' : 'bg-gray-100'} px-3 pt-2`}
                                  key={i.toString()}
                                >
                                  <div className='col-span-1'>{e.key}</div>
                                  <div className='col-span-2'>{e.value}</div>
                                  <div className='col-span-1 mr-4 flex justify-end'>
                                    <AiOutlineEdit
                                      className='mr-1 text-xl text-green-400'
                                      onClick={() => {
                                        setSpecModalType('edit');
                                        setIdSpec(e.id);
                                        openSpecModal(true);
                                        setKeySpec(e.key);
                                        setValueSpec(e.value);
                                      }}
                                    />
                                    <AiOutlineDelete
                                      className='text-xl text-red-400'
                                      onClick={async () => {
                                        await productsApi.deleteSpec(e.id);
                                        toast.success('delete specification success!');
                                        _refetch(refetch + 1);
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          : 'loading...'}
                      </div>
                      <div className='flex items-start justify-end'>
                        <button
                          className='rounded-md bg-red-400 px-4 py-2 text-white shadow-lg'
                          onClick={() => {
                            setSpecModalType('create');
                            openSpecModal(true);
                          }}
                        >
                          {t('detailproduct.addnew')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {specModal && (
            <div className='z-100 fixed inset-0 top-1/2 left-1/2 -translate-x-1/3 -translate-y-3/4'>
              <div className='relative h-full w-full max-w-2xl md:h-auto'>
                <div className='relative rounded-lg bg-white shadow-xl'>
                  <div className='flex items-start justify-between rounded-t border-b p-4'>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      {specModalType === 'create' ? 'Add New Specification' : 'Edit Specification'}
                    </h3>
                    <button
                      onClick={() => {
                        openSpecModal(false);
                        setKeySpec('');
                        setValueSpec('');
                      }}
                      className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900'
                    >
                      <svg
                        aria-hidden='true'
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'></path>
                      </svg>
                      <span className='sr-only'>{t('product.close modal')}</span>
                    </button>
                  </div>

                  <div className='space-y-6 p-6'>
                    <p className='text-base leading-relaxed text-gray-500'>
                      <p>{t('detailproduct.key')}: </p>
                      <input
                        className='w-full rounded-xl border border-gray-400 px-2 py-2'
                        onChange={(e) => setKeySpec(e.target.value)}
                        value={keySpec}
                        disabled={specModalType === 'edit' ? true : false}
                      />
                    </p>
                    <p className='text-base leading-relaxed text-gray-500'>
                      <p>{t('product.value')}:</p>
                      <input
                        className='w-full rounded-xl border border-gray-400 px-2 py-2'
                        onChange={(e) => setValueSpec(e.target.value)}
                        value={valueSpec}
                      />
                    </p>
                  </div>

                  <div className='flex items-center space-x-2 rounded-b border-t border-gray-200 p-6'>
                    <button
                      className='rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '
                      onClick={async () => {
                        if (specModalType === 'create') {
                          await productsApi.createSpec(location.state.id, keySpec, valueSpec);
                          toast.success('create specification for product success!');
                        }
                        if (specModalType === 'edit') {
                          await productsApi.updateOneSpec(specId, valueSpec);
                          toast.success('edit specification for product success!');
                        }
                        setValueSpec('');
                        setKeySpec('');
                        _refetch(refetch + 1);
                      }}
                    >
                      {t('product.confirm')}
                    </button>
                    <button
                      onClick={() => {
                        openSpecModal(false);
                        setKeySpec('');
                        setValueSpec('');
                      }}
                      className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300'
                    >
                      {t('product.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
