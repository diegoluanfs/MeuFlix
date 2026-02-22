import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalStyle } from './styles/GlobalStyle';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import VideoDetailPage from './pages/VideoDetailPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return element;
};

const App: React.FC = () => (
  <AuthProvider>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/videos/:id" element={<PrivateRoute element={<VideoDetailPage />} />} />
        <Route path="/upload" element={<PrivateRoute element={<UploadPage />} />} />
        <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
