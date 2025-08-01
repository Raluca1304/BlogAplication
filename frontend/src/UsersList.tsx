// import React, { JSX, useEffect, useState } from 'react';
// import { User } from './types';

// const ROLES: string[] = ["ROLE_USER", "ROLE_AUTHOR", "ROLE_ADMIN"];


// export function UsersList(): JSX.Element {
//   const [users, setUsers] = useState<User[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   function fetchUsers(): void {
//     const token: string | null = localStorage.getItem('jwt');
//     fetch('/api/users', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => {
//         if (!res.ok) throw new Error('Not authorized or error fetching users');
//         return res.json();
//       })
//       .then((data: User[]) => setUsers(data)) // <- trebuie să actualizeze starea
//       .catch((err: Error) => setError(err.message));
//   }

//   function handleRoleChange(userId: string, newRole: string): void {
//     const token: string | null = localStorage.getItem('jwt');
//     fetch(`/api/users/${userId}/role`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'text/plain',
//         Authorization: `Bearer ${token}`
//       },
//       body: newRole
//     })
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to update role');
//         return res.json();
//       })
//       .then(() => fetchUsers())
//       .catch((err: Error) => setError(err.message));
//   }

//   if (error) return <div style={{ color: 'red' }}>{error}</div>;

//   return (
//     <div style={{ padding: 32 }}>
//       <h2>All Users</h2>
//       <table className="users-table">
//         <thead>
//           <tr className="users-table-head">
//             <th>Username</th>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Change Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(u => (
//             <tr key={u.id}>
//               <td>{u.username}</td>
//               <td>{u.firstName}</td>
//               <td>{u.lastName}</td>
//               <td>{u.email}</td>
//               <td>{u.role}</td>
//               <td>
//                 <select
//                   value={u.role || "ROLE_USER"}
//                   onChange={e => handleRoleChange(u.id, e.target.value)}
//                   disabled={u.role === "ROLE_ADMIN"}
//                 >
//                   {ROLES.map(role => (
//                     <option key={role} value={role}>{role}</option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// } 