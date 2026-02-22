import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141414;
  padding: 1rem;
`;

const Card = styled.div`
  background: #1f1f1f;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const Logo = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: #e50914;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #e5e5e5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  color: #aaa;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #e5e5e5;
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const SubmitButton = styled.button`
  padding: 0.85rem;
  background: #e50914;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #c40812;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorBox = styled.div`
  background: rgba(229, 9, 20, 0.15);
  border: 1px solid #e50914;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #ff6b6b;
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #aaa;

  a {
    color: #e50914;
    &:hover { text-decoration: underline; }
  }
`;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <Logo>MeuFlix</Logo>
        <Title>Criar conta</Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorBox>{error}</ErrorBox>}
          <InputGroup>
            <Label>Usuário</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escolha um usuário"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>E-mail</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              required
              minLength={6}
            />
          </InputGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </SubmitButton>
        </Form>
        <FooterText>
          Já tem conta? <Link to="/login">Entrar</Link>
        </FooterText>
      </Card>
    </PageWrapper>
  );
};

export default RegisterPage;
