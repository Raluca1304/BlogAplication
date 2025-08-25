import { ColumnDef } from '@tanstack/react-table';
import { Post } from '../../../types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NavLink } from 'react-router';
import { ArrowUpDown, PencilLine, Eye, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/formatDataTime';

export const articleColumns: ColumnDef<Post>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs text-gray-600">{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'authorName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Author
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue('authorName') ?? row.original.author?.toString?.() ?? ''}</span>,
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const d = row.getValue<string>('createdDate');
      return <span>{formatDateTime(d)}</span>;
    },
  },
  {
    accessorKey: 'updatedDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Updated
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const d = row.getValue<string>('updatedDate');
      return <span>{formatDateTime(d)}</span>;
    },
  },
  {
    id: 'actions',
    header: () => <span className="font-semibold">Actions</span>,
    cell: ({ row, table }) => {
      const handleDelete = async () => {
        const token = localStorage.getItem("jwt");
        if (!window.confirm("Are you sure you want to delete this article?")) return;
        
        try {
          const res = await fetch(`/api/articles/${row.original.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            // Trigger a page refresh to update the data
            window.location.reload();
          } else {
            alert("Failed to delete article!");
          }
        } catch (err) {
          console.error("Error deleting article:", err);
          alert("Error deleting article!");
        }
      };

      return (
        <div className="flex gap-2">
            <NavLink to={`/admin/articles/${row.original.id}/edit`}>
              <PencilLine className="w-4 h-4 text-green-600 hover:underline text-sm self-center" />
            </NavLink>
          <NavLink to={`/admin/articles/${row.original.id}`} className="text-blue-600 hover:underline text-sm self-center">
            <Eye className="w-4 h-4 text-blue-600 hover:underline text-sm self-center" />
          </NavLink>
                <div  onClick={handleDelete} className="text-blue-600 hover:underline text-sm self-center">
                <Trash2 className="w-4 h-4 text-red-600 hover:underline text-sm self-center" />
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
];


