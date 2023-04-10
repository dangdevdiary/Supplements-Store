import { useLocation, useNavigate } from 'react-router-dom';
import BreadCrumb from '../breadcrumb';
import { useQuery } from '@tanstack/react-query';
import brandApi from 'src/apis/brand.api';
import { useEffect, useState } from 'react';
import productsApi from 'src/apis/product.api';
import { toast } from 'react-toastify';
import HelmetSale from 'src/components/Helmet';

const SpecModal = () => {
  return (
    <div className='z-100 fixed inset-0 top-0 left-1/3 -translate-x-1/3 -translate-y-3/4'>
      <div className='relative h-full w-full max-w-2xl md:h-auto'>
        <div className='relative rounded-lg bg-white shadow-xl'>
          <div className='flex items-start justify-between rounded-t border-b p-4'>
            <h3 className='text-xl font-semibold text-gray-900'>adsf</h3>
            <button className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900'>
              <svg
                aria-hidden='true'
                className='h-5 w-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>

          <div className='space-y-6 p-6'>
            <p className='text-base leading-relaxed text-gray-500'>
              <p>Name: </p>
              <input className='w-full rounded-xl border border-gray-400 px-2 py-2' />
            </p>
            <p className='text-base leading-relaxed text-gray-500'>
              <p>Description:</p>
              <textarea className='w-full rounded-xl border border-gray-400 px-2 py-6' />
            </p>
          </div>

          <div className='flex items-center space-x-2 rounded-b border-t border-gray-200 p-6'>
            <button className='rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '>
              Confirm
            </button>
            <button className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const brand = useQuery(['get_all_brands'], () => brandApi.getAllBrand(''));
  const [name, setName] = useState('');
  const [brand_id, setBrandId] = useState(-1);
  const [image, setImage] = useState<File>();
  const [description, setDesc] = useState('');
  const [ram, setRam] = useState('');
  const [rom, setRom] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [specModal, openSpecModal] = useState(false);

  useEffect(() => {
    if (location.state.type === 'edit') {
      productsApi
        .getProductDetail(location.state.id)
        .then((res) => res.data)
        .then((data) => {
          setName(data.name);
          setBrandId(data.brand_id !== undefined ? data.brand_id : -1);
          setDesc(data.description);
          setSpecs(data.specs);
        });
    }
  }, []);

  const createProduct = async () => {
    if (!image) {
      toast.error('please select image for product');
      return;
    }
    const data = new FormData();
    data.append('name', name);
    data.append('brand_id', `${brand_id}`);
    data.append('description', description);
    data.append('ram', ram);
    data.append('rom', rom);
    data.append('color', color);
    data.append('price', price);
    data.append('image', image);
    const response = await productsApi.createProduct(data);

    if (response.status === 200) toast.success('create new product success!');
    else toast.error(`an error occured when create product: ${response.statusText}`);
  };

  const updateProduct = async () => {
    const response = await productsApi.updateProduct(Number(location.state.id), {
      name,
      description,
      brand_id,
    });

    if (response.status === 200) toast.success('update product success!');
    else toast.error(`an error occured when update product: ${response.statusText}`);
  };

  return (
    <div className='mt-4'>
      <HelmetSale
        title={`Admin Dashboard | ${location.state.type === 'create' ? 'Create Product' : 'Update Product'}`}
      ></HelmetSale>
      <BreadCrumb path={['Product', `${location.state.type === 'create' ? 'Create' : 'Update'} Product`]} />
      <SpecModal />
      <div>
        <div className='mt-4 flex flex-col '>
          <div className='overflow-x-auto drop-shadow-lg'>
            <div className='inline-block w-full align-middle '>
              <div className='overflow-hidden rounded-xl border bg-white p-4'>
                <h1 className='text-lg font-semibold leading-loose'>
                  {location.state.type === 'create' ? 'CREATE PRODUCT' : 'UPDATE INFORMATION PRODUCT'}
                </h1>
                <div className='grid grid-cols-2 gap-4 pt-4'>
                  <div>
                    <p className='text-md pb-1 indent-2 leading-normal'>Name</p>
                    <input
                      type='text'
                      className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                      placeholder='Name...'
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className='text-md pb-1 indent-2 leading-normal'>Select Brand</p>
                    <select
                      className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                      onChange={(e) => setBrandId(Number(e.target.value))}
                    >
                      <option>Select Brand</option>
                      {brand.data?.data.map((e: { id: number; name: string }, i) => (
                        <option key={i.toString()} value={e.id} selected={brand_id === e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {location.state.type === 'create' && (
                  <div className='pt-4'>
                    <p className='text-md pb-1 indent-2 leading-normal'>Image</p>
                    <input
                      className='bg-gray-150 w-full cursor-pointer rounded-lg border border-gray-300 text-sm font-medium leading-loose text-gray-900 focus:outline-none'
                      type='file'
                      onChange={(e) => {
                        const image = e.target.files;
                        if (image?.length) {
                          setImage(image[0]);
                        }
                      }}
                    />
                    <p className='mt-1 text-sm text-gray-500'>JPEG, PNG or JPG (MAX. 800x400px).</p>
                  </div>
                )}
                <div className='pt-4'>
                  <p className='text-md pb-1 indent-2 leading-normal'>Description</p>
                  <textarea
                    placeholder='Description of product...'
                    rows={4}
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                    onChange={(e) => setDesc(e.target.value)}
                    defaultValue={description}
                  ></textarea>
                </div>
                {location.state.type === 'create' && (
                  <>
                    <div className='grid grid-cols-2 gap-4 pt-4'>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal'>RAM</p>
                        <input
                          type='text'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          placeholder='8GB'
                          onChange={(e) => setRam(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal'>ROM</p>
                        <input
                          type='text'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          placeholder='256GB'
                          onChange={(e) => setRom(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 pt-2'>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal'>COLOR</p>
                        <input
                          type='text'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          placeholder='BLACK'
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className='text-md pb-1 indent-2 leading-normal'>PRICE</p>
                        <input
                          type='text'
                          className='bg-gray-150 w-full rounded-md border border-gray-300 py-2 px-4'
                          placeholder='100000'
                          onChange={(e) => setPrice(e.target.value)}
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
                    SAVE
                  </button>
                  <button
                    className='mr-2 mb-2 rounded-lg border border-gray-300 bg-gray-700 px-5 py-2.5 text-sm font-medium text-white text-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200'
                    onClick={() => navigate('/admin/product')}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
          {location.state.type === 'edit' && (
            <div className='mt-4 overflow-x-auto drop-shadow-lg'>
              <div className='inline-block w-full align-middle '>
                <div className='overflow-hidden rounded-xl border bg-white p-4'>
                  <h1 className='text-lg font-semibold leading-loose'>SPECIFICATIONS</h1>
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
                                  <div className='col-span-3'>{e.value}</div>
                                </div>
                              );
                            })
                          : 'loading...'}
                      </div>
                      <div className='flex items-start justify-end'>
                        <button
                          className='rounded-md bg-red-400 px-4 py-2 text-white shadow-lg'
                          onClick={() => openSpecModal(true)}
                        >
                          Add new
                        </button>
                      </div>
                    </div>
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
