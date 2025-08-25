import { ColumnDef } from '@tanstack/react-table';
import { Comment } from '../../../types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NavLink } from 'react-router';
import { ArrowUpDown, PencilLine,Eye, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/formatDataTime';

export const commentColumns: ColumnDef<Comment>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        //onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        ID
        {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs text-gray-600">{row.getValue('id')}</span>,
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
    cell: ({ row }) => <span className="font-medium">{row.getValue('authorName')}</span>,
  },
  {
    id: 'articleTitle',
    accessorFn: (row) => row.article?.title || '',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Article
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.article?.title || 'No article'}</span>
    ),
  },
  {
    accessorKey: 'text',
    header: () => <span className="font-semibold">Text</span>,
    cell: ({ row }) => {
      const text = row.getValue<string>('text');
      return (
        <div className="max-w-96">
          <span className="text-sm">
            {text.length > 100 ? `${text.substring(0, 100)}...` : text}
          </span>
        </div>
      );
    },
    enableSorting: false,
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
      const date = d ? new Date(d) : null;
      return <span>{date ? formatDateTime(date.toISOString()) : '—'}</span>;
    },
  },
  {
    id: 'actions',
    header: () => <span className="font-semibold">Actions</span>,
    cell: ({ row }) => {
      const handleDelete = async () => {
        const token = localStorage.getItem("jwt");
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        
        try {
          const res = await fetch(`/api/comments/${row.original.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            // Trigger a page refresh to update the data
            window.location.reload();
          } else {
            alert("Failed to delete comment!");
          }
        } catch (err) {
          console.error("Error deleting comment:", err);
          alert("Error deleting comment!");
        }
      };

      return (
        <div className="flex gap-2">
            <NavLink to={`/admin/comments/${row.original.id}/edit`}>
              <PencilLine className="w-4 h-4 text-green-600 hover:underline text-sm self-center" />
            </NavLink>
          <NavLink to={`/admin/comments/${row.original.id}`} className="text-blue-600 hover:underline text-sm self-center">
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
