import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Nav = styled.nav`
  background-color: #0a0a0a;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #e50914;
  letter-spacing: 2px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #e5e5e5;
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: #e50914;
  }
`;

const UserInfo = styled.span`
  color: #aaa;
  font-size: 0.85rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid #e50914;
  color: #e50914;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    background: #e50914;
    color: #fff;
  }
`;

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Nav>
      <Logo to="/">MeuFlix</Logo>
      <NavLinks>
        {isAuthenticated ? (
          <>
            <NavLink to="/">Vídeos</NavLink>
            <NavLink to="/upload">Upload</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <UserInfo>{user?.username}</UserInfo>
            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Cadastro</NavLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
