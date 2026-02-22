import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <Navbar />
    <Main>{children}</Main>
  </>
);

export default Layout;
