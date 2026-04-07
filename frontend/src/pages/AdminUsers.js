import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(data);
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    }
  };

  return (
    <div>
      <h2>All Users</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td><button onClick={() => deleteUser(user._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}