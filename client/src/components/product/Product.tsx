import { Link } from 'react-router-dom';
import { Product as ProductType } from 'src/types/product.type';
import { formatPrice } from 'src/utils/formatPrice';
import Star from '../star';
interface Props {
  product: Omit<ProductType, 'brand_description' | 'createAt' | 'updateAt' | 'specs'>;
}
function Product({ product }: Props) {
  return (
    <Link to={`/product/${product.id}`} className=''>
      <div className='flex h-full flex-col overflow-hidden rounded-lg bg-white p-2 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md'>
        <div className='relative w-full flex-shrink-0 pt-[100%]'>
          <img
            className='absolute top-0 left-0 h-full w-full object-contain'
            src={'http://localhost:3000/' + product.images.imageUrl}
            alt=''
          />
        </div>
        <div className='mt-auto'>
          <div className='overflow-hidden p-1'>
            <h3 className='min-h-[1.75rem] text-sm duration-150 line-clamp-2 hover:text-orange-600'>{product.name}</h3>
          </div>
          <div className='p-1'>
            <span className='text-base text-orange-700 line-clamp-1'>
              {formatPrice(Number(product.productOptions[0].price))}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-gray-600'>{product.brand}</span>
            <Star ratings={product.rate} />
          </div>
        </div>
      </div>
    </Link>
  );
}
export default Product;
