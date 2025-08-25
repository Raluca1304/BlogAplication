import { ColumnDef } from '@tanstack/react-table';
import { User } from '../../../types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavLink } from 'react-router';
import { ArrowUpDown, Eye, PencilLine, Trash2 } from 'lucide-react';

const ROLES = ['ROLE_USER', 'ROLE_AUTHOR', 'ROLE_ADMIN'];

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        ID
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs text-gray-600">{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Username
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue('username')}</span>,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue('firstName')}</span>,
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Last Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue('lastName')}</span>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm">{row.getValue('email')}</span>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <Button
        variant="ghost"
        //onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 h-auto font-semibold hover:bg-transparent"
      >
        Role
      </Button>
    ),
    cell: ({ row }) => (
      <span className="px-2 py-1 text-xs">
        {row.getValue<string>('role')?.replace('ROLE_', '') || 'USER'}
      </span>
    ),
  },
  
  {
    id: 'actions',
    header: () => <span className="font-semibold">Actions</span>,
    cell: ({ row }) => {
      const handleDelete = async () => {
        const token = localStorage.getItem("jwt");
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        
        try {
          const res = await fetch(`/api/users/${row.original.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            // Trigger a page refresh to update the data
            window.location.reload();
          } else {
            alert("You are not allowed to delete this user!");
          }
        } catch (err) {
          console.error("Error deleting user:", err);
          alert("Error deleting user!");
        }
      };

      const isAdmin = row.original.role === 'ROLE_ADMIN';

      return (
        <div className="flex gap-2">
            <NavLink to={`/admin/users/${row.original.id}/edit`}>
              <PencilLine className="w-4 h-4 text-green-600 hover:underline text-sm self-center" />
            </NavLink>
          <NavLink to={`/admin/users/${row.original.id}`} className="text-blue-600 hover:underline text-sm self-center">
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
