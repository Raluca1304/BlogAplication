import React, { useEffect, useState } from 'react';

const ROLES = ["ROLE_USER", "ROLE_AUTHOR", "ROLE_ADMIN"];

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    const token = localStorage.getItem('jwt');
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authorized or error fetching users');
        return res.json();
      })
      .then(setUsers) // <- trebuie să actualizeze starea
      .catch(err => setError(err.message));
  }

  function handleRoleChange(userId, newRole) {
    const token = localStorage.getItem('jwt');
    fetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token}`
      },
      body: newRole
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update role');
        return res.json();
      })
      .then(() => fetchUsers())
      .catch(err => setError(err.message));
  }

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2>All Users</h2>
      <table className="users-table">
        <thead>
          <tr className="users-table-head">
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.userName || u.username}</td>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u.id, e.target.value)}
                  disabled={u.role === "ROLE_ADMIN"}
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
