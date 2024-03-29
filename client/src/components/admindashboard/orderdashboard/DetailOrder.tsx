import { useQuery } from '@tanstack/react-query';
import BreadCrumb from '../breadcrumb';
import orderApi from 'src/apis/order.api';
import { formatPrice } from 'src/utils/formatPrice';
import HelmetSale from 'src/components/Helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { PrintOrder } from './PrintOrder';
import { useReactToPrint } from 'react-to-print';

export default function DetailOrder() {
  const { t } = useTranslation('addashboard');
  const { order_id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  if (!Number(order_id)) navigate('/admin/order');
  const { data, refetch } = useQuery(['get_order_details'], () => orderApi.getOneOrder(Number(order_id)));

  const order = data?.data;
  const date = new Date(order ? order?.create_at : '');
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return (
    <div className='mt-4'>
      <HelmetSale title={t('orders.detailorder')}></HelmetSale>
      <BreadCrumb path={[t('maindashboard.products'), t('orders.orderdashboard'), t('detailproduct.detail')]} />
      <div>
        <div className='mt-4 flex flex-col'>
          <div className='hidden'>
            <PrintOrder
              t={t}
              ref={printRef}
              id={Number(order?.order_id) ? Number(order?.order_id) : 0}
              name={`${order?.user.firstName} ${order?.user.lastName}`}
              date={` ${('0' + day).slice(-2)}/${('0' + month).slice(-2)}/${year} ${hours}:${minutes}:${seconds}`}
              method_payment={order?.payment.method ? order?.payment.method : ''}
              order_items={order?.order_items ? order?.order_items : []}
              discount={Number(order?.payment.discount) ? Number(order?.payment.discount) : 0}
              total={Number(order?.payment.amount) ? Number(order?.payment.amount) : 0}
            />
          </div>
          <div className='overflow-x-auto'>
            <div className='inline-block w-full align-middle'>
              <div className='overflow-hidden rounded-xl border bg-white p-4'>
                <h1 className='py-2 text-lg font-semibold'>{t('orders.detailorder')}</h1>
                <div className='grid grid-cols-2'>
                  <div className='leading-md'>
                    <div className='pt-1'>
                      {t('orders.idorder')}: {order?.order_id}
                    </div>
                    <div className='pt-1'>
                      {t('orders.status')}: {order?.status}
                    </div>
                    <div className='pt-1'>
                      {t('orders.customer')}: {`${order?.user.firstName} ${order?.user.lastName}`}
                    </div>
                    <div className='pt-1'>
                      {t('orders.methodpayment')}: {order?.payment.method}
                    </div>
                    <div className='pt-1'>
                      {t('orders.paid')}: {order?.payment.is_paid ? 'YES' : 'NO'}
                    </div>
                    <div className='pt-1'>
                      {t('orders.date')}:
                      {` ${('0' + day).slice(-2)}/${('0' + month).slice(-2)}/${year} ${hours}:${minutes}:${seconds}`}
                    </div>
                  </div>
                  <div className='mb-32 flex justify-end'>
                    {order?.status === 'PROCESSING' && (
                      <button
                        className='mx-4 h-12 rounded-md border border-gray-300 bg-pink-500 px-2 text-white md:h-full md:px-8'
                        onClick={async () => {
                          await orderApi.updateStatus('SHIPPED', order.order_id);
                          toast.success(`update status order #${order.order_id} from PROCESSING to SHIPPED success!`);
                          refetch();
                        }}
                      >
                        {t('orders.shipped')}
                      </button>
                    )}
                    {order?.status === 'SHIPPED' && (
                      <button
                        className='mx-4 h-12 rounded-md border border-gray-300 bg-green-500 px-2 text-white md:h-full md:px-8'
                        onClick={async () => {
                          await orderApi.updateStatus('COMPLETED', order.order_id);
                          toast.success(`update status order #${order.order_id} from SHIPPED to COMPLETED success!`);
                          refetch();
                        }}
                      >
                        {t('orders.completed')}
                      </button>
                    )}
                    {order?.status === 'COMPLETED' && (
                      <button
                        className='mx-4 h-12 rounded-md border border-gray-300 bg-purple-500 px-2 text-white md:h-full md:px-8'
                        onClick={handlePrint}
                      >
                        {t('orders.print')}
                      </button>
                    )}
                    {order?.status === 'RETURNED' && (
                      <button
                        className='mx-4 h-12 rounded-md border border-gray-300 bg-blue-500 px-2 text-white md:h-full md:px-8'
                        onClick={async () => {
                          await orderApi.updateStatus('RETURNED_COMPLETED', order.order_id);
                          toast.success(
                            `update status order #${order.order_id} from RETURNED to RETURNED_COMPLETED success!`
                          );
                          refetch();
                        }}
                      >
                        {t('orders.returned_completed')}
                      </button>
                    )}
                  </div>
                </div>
                <hr className='my-2 bg-gray-600' />
                <div className='overflow-x-scroll'>
                  <table className='mb-6 min-w-full divide-y divide-gray-200 rounded-md border border-gray-300 bg-white'>
                    <thead className='bg-cyan-600/20'>
                      <tr>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 '>
                          ID
                        </th>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 '>
                          {t('product.name')}
                        </th>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 '>
                          {t('detailproduct.detail')}
                        </th>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 '>
                          {t('detailproduct.price')}
                        </th>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 '>
                          {t('orders.quantity')}
                        </th>
                        <th scope='col' className='px-6 py-3 text-center text-xs font-bold uppercase text-gray-500 '>
                          {t('orders.amount')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {order?.order_items.map((e, i) => {
                        return (
                          <tr key={i.toString()}>
                            <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800'>
                              {e.product_option_id}
                            </td>
                            <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>{e.product_name}</td>
                            <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>{`${e.flavor} - ${e.weight}`}</td>
                            <td className='text-md whitespace-nowrap px-6 py-4 text-gray-800'>
                              {formatPrice(e.prices)}
                            </td>
                            <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>{e.quantity}</td>
                            <td className='text-md whitespace-nowrap px-6 py-4 text-center text-gray-800'>
                              {formatPrice(e.prices * e.quantity)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={5}></td>
                        <td colSpan={1} className='mr-4 flex justify-end py-2'>
                          {t('orders.discount')}: {formatPrice(Number(order?.payment.discount))}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5}></td>
                        <td colSpan={1} className='mr-4 flex justify-end py-2'>
                          {t('orders.total')}: {formatPrice(Number(order?.payment.amount))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
