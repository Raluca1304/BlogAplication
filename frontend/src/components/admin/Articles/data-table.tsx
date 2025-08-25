import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

type FooterArgs = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows: number;
  setPageIndex: (idx: number) => void;
  setPageSize: (size: number) => void;
  selectedRows: RowSelectionState;
  selectedCount: number;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string; // e.g. 'title'
  pageSize?: number;
  renderFooter?: (args: FooterArgs) => React.ReactNode;
  customFilters?: (globalFilter: string, setGlobalFilter: (value: string) => void) => React.ReactNode;
};

export function DataTable<TData, TValue>({ columns, data, filterColumn = 'title', pageSize = 10, renderFooter, customFilters }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>('');
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row, index) => String(index),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="w-full">
      {customFilters ? (
        customFilters(globalFilter, setGlobalFilter)
      ) : (
        <div className="flex items-center justify-between py-3 gap-4">
          <Input
            placeholder={`Search ${filterColumn}...`}
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {renderFooter && (
        <div className="mt-3">
          {renderFooter({
            pageIndex: table.getState().pagination.pageIndex,
            pageSize: table.getState().pagination.pageSize,
            pageCount: table.getPageCount(),
            totalRows: table.getFilteredRowModel().rows.length,
            setPageIndex: (idx) => table.setPageIndex(idx),
            setPageSize: (size) => table.setPageSize(size),
            selectedRows: table.getState().rowSelection,
            selectedCount: table.getFilteredSelectedRowModel().rows.length,
          })}
        </div>
      )}
    </div>
  );
}


