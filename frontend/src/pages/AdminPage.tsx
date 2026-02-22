import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { listUsers, updateUserRole } from '../api/users';
import { User } from '../types';
import Layout from '../components/Layout/Layout';

const Title = styled.h1`
  font-size: 1.6rem;
  color: #e5e5e5;
  margin-bottom: 2rem;
`;

const Table = styled.div`
  background: #1f1f1f;
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
  padding: 1rem 1.5rem;
  background: #2a2a2a;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    & > :nth-child(2) { display: none; }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #2a2a2a;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    & > :nth-child(2) { display: none; }
  }
`;

const Cell = styled.div`
  font-size: 0.9rem;
  color: #e5e5e5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $role }) => ($role === 'admin' ? '#e50914' : '#2a2a2a')};
  border: 1px solid ${({ $role }) => ($role === 'admin' ? '#e50914' : '#444')};
  color: ${({ $role }) => ($role === 'admin' ? '#fff' : '#aaa')};
`;

const RoleSelect = styled.select`
  background: #2a2a2a;
  border: 1px solid #444;
  color: #e5e5e5;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const CenteredMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 3rem;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e50914;
  margin-top: 2rem;
`;

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar usuários.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    setUpdateError(null);
    try {
      const updated = await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || 'Erro ao atualizar role.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Layout>
      <Title>Gerenciamento de Usuários</Title>

      {loading && <CenteredMessage>Carregando usuários...</CenteredMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && (
        <>
          {updateError && <ErrorMessage>{updateError}</ErrorMessage>}
          <Table>
          <TableHeader>
            <div>Usuário</div>
            <div>E-mail</div>
            <div>Role atual</div>
            <div>Alterar role</div>
          </TableHeader>
          {users.length === 0 ? (
            <CenteredMessage>Nenhum usuário encontrado.</CenteredMessage>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <Cell>{user.username}</Cell>
                <Cell>{user.email}</Cell>
                <Cell>
                  <RoleBadge $role={user.role}>{user.role}</RoleBadge>
                </Cell>
                <Cell>
                  <RoleSelect
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updating === user.id}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </RoleSelect>
                </Cell>
              </TableRow>
            ))
          )}
        </Table>
        </>
      )}
    </Layout>
  );
};

export default AdminPage;
