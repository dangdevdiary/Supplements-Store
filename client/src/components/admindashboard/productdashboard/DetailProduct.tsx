import { useMutation, useQuery } from '@tanstack/react-query';
import BreadCrumb from '../breadcrumb';
import { formatPrice } from 'src/utils/formatPrice';
import HelmetSale from 'src/components/Helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import productsApi from 'src/apis/product.api';
import { dateToString } from 'src/utils/convertDate';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineFileSearch } from 'react-icons/ai';
import { baseURL } from 'src/constants/constants';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridReact } from 'ag-grid-react';
import { type CellClickedEvent, type ColDef } from 'ag-grid-community';
import feedbackApi from 'src/apis/feedback.api';

const OptionModal = ({
  id,
  setModal,
  refetch,
  type,
  data,
}: {
  type: string;
  id: number;
  setModal: Dispatch<
    SetStateAction<{
      open: boolean;
      type: string;
    }>
  >;
  refetch: any;
  data?: {
    flavor: string;
    weight: string;
    price: string;
    product_option_id: number;
  };
}) => {
  const [productOptData, setProductOptData] = useState<{
    image?: File;
    flavor: string;
    weight: string;
    price: string;
  }>({
    image: undefined,
    flavor: data ? data.flavor : '',
    weight: data ? data.weight : '',
    price: data ? data.price : '',
  });

  const createOption = async () => {
    if (!productOptData.image) {
      toast.error('please select image for product');
      return;
    }
    const data = new FormData();
    data.append('image', productOptData.image);
    data.append('flavor', productOptData.flavor);
    data.append('weight', productOptData.weight);
    data.append('price', productOptData.price);

    await productsApi
      .createOption(id, data)
      .then(() => {
        toast.success('Tạo tùy chọn thành công');
      })
      .catch(() => {
        toast.error('Không thể tạo tùy chọn');
      });
  };

  const editOption = async () => {
    console.log(1);
    const response = await productsApi.updateOption(data?.product_option_id ? data.product_option_id : 0, {
      flavor: productOptData.flavor,
      weight: productOptData.weight,
      price: productOptData.price,
    });
    if (response.status === 200) toast.success('update product success!');
    else toast.error(`an error occured when create product: ${response.statusText}`);
  };
  const { t } = useTranslation('addashboard');

  return (
    <div className='z-100 fixed inset-0 -top-80 left-1/3 -translate-x-1/3 -translate-y-1'>
      <div className='relative h-full w-full max-w-2xl md:h-auto'>
        <div className='relative rounded-lg bg-white shadow-xl'>
          <div className='flex items-start justify-between rounded-t border-b p-4'>
            <h3 className='text-xl font-semibold text-gray-900'>
              {type === 'create' ? t('detailproduct.addnewoption') : t('detailproduct.editoption')}
            </h3>
            <button
              onClick={() => setModal({ open: false, type: '' })}
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

          <div className='space-y-6 p-2 md:p-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='px-4 text-base leading-relaxed text-gray-500 md:px-8'>
                <p>Hương vị: </p>
                <input
                  onChange={(e) => setProductOptData({ ...productOptData, flavor: e.target.value })}
                  defaultValue={productOptData.flavor}
                  className='w-full rounded-xl border border-gray-400 px-2 py-2'
                />
              </div>
              <div className='-ml-10 px-8 text-base leading-relaxed text-gray-500 md:mr-8'>
                <p>Trọng lượng:</p>
                <input
                  onChange={(e) => setProductOptData({ ...productOptData, weight: e.target.value })}
                  defaultValue={productOptData.weight}
                  className='w-full rounded-xl border border-gray-400 px-2 py-2'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='px-8 text-base leading-relaxed text-gray-500'>
                <p>{t('detailproduct.price')}:</p>
                <input
                  defaultValue={productOptData.price}
                  onChange={(e) => setProductOptData({ ...productOptData, price: e.target.value })}
                  className='w-full rounded-xl border border-gray-400 px-2 py-2'
                />
              </div>
            </div>
            {type === 'create' && (
              <div className='mr-8 grid grid-cols-1'>
                <div className='px-8 text-base leading-relaxed text-gray-500'>
                  <p>{t('detailproduct.image')}: </p>
                  <input
                    type='file'
                    onChange={(e) => {
                      const image = e.target.files;
                      if (image?.length) {
                        setProductOptData({ ...productOptData, image: image[0] });
                      }
                    }}
                    className='bg-gray-150 w-full cursor-pointer rounded-lg border border-gray-300 text-sm font-medium leading-loose text-gray-900 focus:outline-none'
                  />
                  <p className='mt-1 text-sm text-gray-500'>JPEG, PNG or JPG (MAX. 800x400px).</p>
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center space-x-2 rounded-b border-t border-gray-200 p-6'>
            <button
              onClick={async () => {
                if (type === 'create') await createOption();
                if (type === 'edit') await editOption();
                refetch();
              }}
              className='rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '
            >
              {t('product.confirm')}
            </button>
            <button
              className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300'
              onClick={() => setModal({ open: false, type: '' })}
            >
              {t('product.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Btb(
  e: CellClickedEvent & {
    btnIcon: ReactNode;
    mode: string;
    rowData: { [key: string]: string }[];
    rowSelected?: { [key: string]: string };
  }
) {
  return <button className='px-2 py-2'>{e.btnIcon}</button>;
}

export default function DetailProduct() {
  const [modal, setModal] = useState({
    open: false,
    type: 'create',
  });
  const [data_opt, setDataOpt] = useState({
    flavor: '',
    weight: '',
    price: '',
    product_option_id: 0,
  });

  const { productId } = useParams();
  const navigate = useNavigate();
  if (productId === undefined || !Number(productId)) navigate('/admin/product');
  const { data, refetch } = useQuery(['get_product_details'], {
    queryFn: () => productsApi.getProductDetail(productId !== undefined ? productId : '1'),
    onSuccess: (data) => {
      const rs = data.data.feedback.map((e) => {
        return {
          ...e,
          user: e.user?.email || 'user',
        };
      });
      setRowData(rs);
    },
  });
  const deleteFeedbackMutation = useMutation({
    mutationFn: (fid: number) => feedbackApi.deleteFeedback(fid),
    onSuccess: () => {
      toast.success('Xoá đánh giá thành công');
      refetch();
    },
    onError: () => {
      toast.error('Không thể xóa đánh giá');
    },
  });
  const product = data?.data;
  const productOptions = product?.productOptions ? product.productOptions : [];
  const { t } = useTranslation('addashboard');
  const [rowData, setRowData] = useState<
    {
      id: number;
      rate: number;
      comment: string;
      create_at: string;
      user: string;
    }[]
  >([]);
  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  const columnDefs: ColDef[] = [
    { field: 'id', headerName: 'id', width: 60 },
    { field: 'user', headerName: 'Nguời đánh giá' },
    { field: 'rate', headerName: 'Số sao', width: 100 },
    { field: 'comment', headerName: 'Nội dung đánh giá', minWidth: 400, flex: 1 },

    {
      field: 'delete',
      headerName: 'Xóa',
      width: 80,
      cellRenderer: Btb,
      cellRendererParams: {
        btnIcon: <AiOutlineDelete className='text-2xl text-red-500' />,
      },
      onCellClicked(event) {
        deleteFeedbackMutation.mutate(event.data.id);
      },
    },
  ];
  return (
    <div className='mt-4'>
      <HelmetSale title={t('detailproduct.ad detail')}></HelmetSale>
      <BreadCrumb
        path={[t('maindashboard.products'), t('detailproduct.productdashboard'), t('detailproduct.detail')]}
      />
      <div>
        <div className='mt-4 flex flex-col'>
          <div className='overflow-x-auto'>
            <div className='grid w-full gap-4 align-middle'>
              <div className=' overflow-hidden rounded-xl border bg-white p-4 shadow-lg'>
                <h1 className='py-2 text-lg font-semibold'>{t('detailproduct.productdetails')}</h1>
                <div className='grid grid-cols-4 border-b-2  pt-1'>
                  <p className='col-span-1'>{t('detailproduct.idproduct')}</p>{' '}
                  <p className='col-span-3'>{product?.id}</p>
                </div>
                <div className='grid grid-cols-4 border-b-2  pt-1'>
                  <p className='col-span-1'>{t('detailproduct.nameproduct')}</p>{' '}
                  <p className='col-span-3'>{product?.name}</p>
                </div>
                <div className='grid grid-cols-4 border-b-2  pt-1'>
                  <p className='col-span-1'>{t('product.brand')}</p> <p className='col-span-3'>{product?.brand}</p>
                </div>
                <div className='h-26 grid grid-cols-4 overflow-hidden border-b-2  pt-1'>
                  <p className='col-span-1'>{t('product.description')}</p>{' '}
                  <span className='col-span-3 overflow-ellipsis line-clamp-4'>{product?.description}</span>
                </div>
                <div className='grid grid-cols-4 border-b-2 pt-1'>
                  <p className='col-span-1'>Ngày sản xuất</p>{' '}
                  <span className='col-span-3 overflow-ellipsis  line-clamp-4'>{product?.productionDate}</span>
                </div>
                <div className='grid grid-cols-4 border-b-2 pt-1'>
                  <p className='col-span-1'>Ngày hết hạn</p>{' '}
                  <span className='col-span-3 overflow-ellipsis  line-clamp-4'>{product?.expirationDate}</span>
                </div>
                <div className='grid grid-cols-4 border-b-2 pt-1'>
                  <p className='col-span-1'>{t('detailproduct.createat')}</p>{' '}
                  <p className='col-span-3'>{dateToString(product?.createAt ? product.createAt : '')}</p>
                </div>
                <div className='grid grid-cols-4 border-b-2 pt-1'>
                  <p className='col-span-1'>{t('detailproduct.updateat')}</p>{' '}
                  <p className='col-span-3'>{dateToString(product?.updateAt ? product.updateAt : '')}</p>
                </div>
              </div>
            </div>

            <div className='mt-4 mb-4 inline-block w-full gap-4 align-middle'>
              <div className='rounded-xl bg-white p-4 drop-shadow-lg'>
                <div className='grid grid-cols-2'>
                  <h1 className='py-2 text-lg font-semibold'>{t('detailproduct.productoptions')}</h1>
                  <div className='flex justify-end'>
                    <button
                      className='mr-8 rounded-lg bg-red-400 px-4 py-2 text-white'
                      onClick={() =>
                        setModal({
                          type: 'create',
                          open: true,
                        })
                      }
                    >
                      {t('detailproduct.addoption')}
                    </button>
                  </div>
                </div>
                <div className='relative mt-4 overflow-x-auto'>
                  <table className='w-full text-left text-sm text-gray-500'>
                    <thead className='bg-cyan-100 text-xs uppercase text-gray-700'>
                      <tr>
                        <th className='px-2 py-3'>{t('detailproduct.idoption')}</th>
                        <th className='px-6 py-3'>{t('detailproduct.image')}</th>
                        <th className='px-6 py-3'>{t('detailproduct.specifications')}</th>
                        <th className='px-6 py-3'>{t('detailproduct.price')}</th>
                        <th className='px-6 py-3 text-center'>{t('product.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productOptions.map((e, i) => {
                        return (
                          <tr className='border-b bg-white' key={i.toString()}>
                            <th className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'>
                              {e.product_option_id}
                            </th>
                            <td className='px-6 py-4'>
                              <img
                                className='w-26 h-28 text-left'
                                src={`${baseURL}/${e.image?.imageUrl !== undefined ? e.image?.imageUrl : ''}`}
                                alt={`product_image`}
                              />
                            </td>
                            <td className='px-6 py-4'>{`${e.flavor} - ${e.weight}`}</td>
                            <td className='px-6 py-4'>{formatPrice(Number(e.price) ? Number(e.price) : 0)}</td>
                            <td className='px-6 py-4 text-center'>
                              <button className='pr-1 text-blue-500 hover:text-blue-700'>
                                <AiOutlineFileSearch
                                  className='text-2xl'
                                  onClick={() => navigate(`../product/detail/option/${e.product_option_id}`)}
                                />
                              </button>
                              <button
                                className='pr-1 text-green-500 hover:text-green-700'
                                onClick={() => {
                                  setDataOpt({
                                    flavor: e.flavor ? e.flavor : '',
                                    weight: e.weight ? e.weight : '',
                                    price: e.price ? e.price : '',
                                    product_option_id: e.product_option_id ? e.product_option_id : 0,
                                  });
                                  setModal({
                                    type: 'edit',
                                    open: true,
                                  });
                                }}
                              >
                                <AiOutlineEdit className='text-2xl' />
                              </button>
                              <button
                                className='text-red-500 hover:text-red-700'
                                onClick={async () => {
                                  await productsApi.deleteOption(e.product_option_id ? e.product_option_id : 0);
                                  toast.success('delete option success!');
                                  refetch();
                                }}
                              >
                                <AiOutlineDelete className='text-2xl' />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {modal.open && (
                    <OptionModal
                      type={modal.type}
                      id={product?.id !== undefined ? product.id : 0}
                      setModal={setModal}
                      refetch={refetch}
                      data={modal.type === 'edit' ? data_opt : undefined}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className='mt-4 mb-4 inline-block w-full gap-4 align-middle'>
              <div className='rounded-xl bg-white p-4 drop-shadow-lg'>
                <h1 className='py-2 text-lg font-semibold'>Đánh giá sản phẩm</h1>
                <div className='ag-theme-balham h-screen w-full'>
                  <AgGridReact
                    rowStyle={{ fontSize: '16px', padding: '10px' }}
                    animateRows
                    defaultColDef={defaultColDef}
                    gridOptions={{
                      rowHeight: 50,
                      headerHeight: 50,
                      domLayout: 'autoHeight',
                    }}
                    rowData={rowData}
                    columnDefs={columnDefs}
                  ></AgGridReact>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
