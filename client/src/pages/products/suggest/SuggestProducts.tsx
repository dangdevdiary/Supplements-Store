import { BiBrain } from 'react-icons/bi';
import BmiForm from './BmiForm';
import { useState } from 'react';
import { Product as IProduct } from 'src/types/product.type';
import Product from 'src/components/product';

function SuggestProducts() {
  const [suggestProducts, setSuggestProducts] = useState<IProduct[]>();

  const handleDataFromChild = (data: IProduct[]) => {
    setSuggestProducts(data);
  };

  return (
    <section className='mx-auto mb-4 mt-4 max-w-7xl overflow-hidden rounded-sm bg-orange-500 pb-8 shadow-md'>
      <div className='mb-6 flex items-center justify-center bg-white p-2'>
        <BiBrain className='text-4xl text-orange-500' />
        <h2 className='ml-2 text-center text-2xl font-semibold uppercase text-orange-500 md:text-3xl'>
          Gợi ý sản phẩm
        </h2>
      </div>

      <BmiForm handleDataFromChild={handleDataFromChild} />

      <div className='mt-4 grid grid-cols-2 gap-2 p-4 md:grid-cols-3'>
        {suggestProducts &&
          suggestProducts.map((product) => {
            return (
              <div className='col-span-1 min-h-[280px]' key={product.id}>
                <Product product={product} />
              </div>
            );
          })}
      </div>
      <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'></div>
    </section>
  );
}

export default SuggestProducts;
