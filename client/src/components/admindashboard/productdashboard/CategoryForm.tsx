import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import categoryApi from 'src/apis/category.api';

function CategoryForm() {
  const location = useLocation();
  const categories = location.state.categories;
  const category = location.state.category;
  const mode = location.state.type as string;
  const createCateMutation = useMutation({
    mutationFn: (data: { cateName: string; cateDescription: string; parentCateId: number }) =>
      categoryApi.createCategory(data),
    onSuccess: () => {
      toast.success('Tạo danh mục thành công');
      setNewCate({
        cateId: -1,
        cateDescription: '',
        cateName: '',
        parentCateId: -1,
      });
    },
  });
  const updateCateMutation = useMutation({
    mutationFn: (data: { cateId: number; parentCateId: number; cateName: string; cateDescription: string }) =>
      categoryApi.update(data),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công');
    },
  });
  const [newCate, setNewCate] = useState<{
    cateId: number;
    cateName: string;
    cateDescription: string;
    parentCateId: number;
  }>({
    cateId: category?.Id || -1,
    cateDescription: mode === 'update' ? category.cateDescription : '',
    cateName: mode === 'update' ? category.cateName : '',
    parentCateId: mode === 'update' ? category.update : -1,
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'create' && newCate)
      createCateMutation.mutate({
        cateName: newCate.cateName,
        cateDescription: newCate.cateDescription,
        parentCateId: newCate.parentCateId,
      });
    if (mode === 'update' && newCate) updateCateMutation.mutate(newCate);
  };
  return (
    <div className='mt-4'>
      <h3>{mode === 'update' ? 'Cập nhật danh mục' : 'Tạo danh mục'}</h3>
      <form className='rounded-md bg-white p-4' onSubmit={handleSubmit}>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='floating_first_name'
              id='floating_first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=''
              value={newCate.cateName}
              onChange={(e) => {
                setNewCate((prev) => {
                  return {
                    ...prev,
                    cateName: e.target.value,
                  };
                });
              }}
              required
            />
            <label
              htmlFor='floating_first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Tên danh mục
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='floating_last_name'
              id='floating_last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
              value={newCate.cateDescription}
              onChange={(e) => {
                setNewCate((prev) => {
                  return {
                    ...prev,
                    cateDescription: e.target.value,
                  };
                });
              }}
            />
            <label
              htmlFor='floating_last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Mô tả danh mục
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div>
            <label htmlFor='countries' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
              Chọn danh mục cha
            </label>
            <select
              id='countries'
              onChange={(e) => {
                setNewCate((prev) => {
                  return {
                    ...prev,
                    parentCateId: Number(e.target.value),
                  };
                });
              }}
              className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            >
              <option value={-1}>Không</option>
              {categories &&
                categories.map((e: any) => {
                  return (
                    <option selected={mode === 'update' && e.cateName === category.parent} key={e.Id} value={e.Id}>
                      {e.cateName}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <button
          type='submit'
          className='mt-4 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
