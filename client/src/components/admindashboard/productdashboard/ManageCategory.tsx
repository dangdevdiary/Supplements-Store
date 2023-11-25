import { type CellClickedEvent, type ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import categoryApi from 'src/apis/category.api';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.min.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BreadCrumb from '../breadcrumb';
// import { ICategory, IManageCategory } from 'src/types/category.type';

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
function ManageCategory() {
  const navigate = useNavigate();

  const { refetch: refreshGetCates } = useQuery(['getAllCate'], () => categoryApi.getAllCategory(), {
    onSuccess: (data) => {
      const rs = data.data.data.map((e) => {
        return {
          Id: e.cateId.toString(),
          cateName: e.cateName,
          cateDescription: e.cateDescription,
          parent: e.parent?.cateName || 'none',
          update: e.parent?.cateId.toString(),
        };
      });
      setRowData(rs);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const deleteCateMutation = useMutation({
    mutationFn: (cateId: number) => categoryApi.delete(cateId),
    onSuccess: () => {
      toast.success('Xoá danh mục thành công');
      refreshGetCates();
    },
    onError: () => {
      toast.error('Không thể xóa danh mục');
    },
  });
  const [rowData, setRowData] = useState<{ [key: string]: string }[]>([]);
  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  const columnDefs: ColDef[] = [
    { field: 'Id', headerName: 'Id', width: 60 },
    { field: 'cateName', headerName: 'Tên danh mục' },
    { field: 'cateDescription', headerName: 'Mô tả', minWidth: 400 },
    { field: 'parent', headerName: 'Danh mục cha' },
    {
      field: 'update',
      headerName: 'Cập nhật',
      width: 120,
      cellRenderer: Btb,
      cellRendererParams: {
        btnIcon: <AiOutlineEdit className='text-2xl text-green-500' />,
      },
      onCellClicked: (ev) => {
        navigate('./create', {
          state: {
            type: 'update',
            category: ev.data,
            categories: rowData,
          },
        });
      },
    },
    {
      field: 'delete',
      headerName: 'Xóa',
      width: 80,
      cellRenderer: Btb,
      cellRendererParams: {
        btnIcon: <AiOutlineDelete className='text-2xl text-red-500' />,
      },
      onCellClicked(event) {
        deleteCateMutation.mutate(event.data.Id);
      },
    },
  ];
  return (
    <>
      <div className='my-2'>
        <BreadCrumb path={['Wheystore', 'Quản trị', 'Danh mục']} />
        <button
          onClick={() =>
            navigate('./create', {
              state: {
                type: 'create',
                categories: rowData,
              },
            })
          }
          className='mt-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
        >
          Tạo danh mục
        </button>
      </div>
      <div className='ag-theme-balham h-screen w-full'>
        <AgGridReact
          rowStyle={{ fontSize: '16px', padding: '10px' }}
          animateRows
          defaultColDef={defaultColDef}
          gridOptions={{
            rowHeight: 50,
            headerHeight: 50,
          }}
          rowData={rowData}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
    </>
  );
}

export default ManageCategory;
