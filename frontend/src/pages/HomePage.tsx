import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { listVideos } from '../api/videos';
import { Video } from '../types';
import VideoCard from '../components/VideoCard/VideoCard';
import Layout from '../components/Layout/Layout';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  color: #e5e5e5;
`;

const RefreshButton = styled.button`
  background: transparent;
  border: 1px solid #555;
  color: #aaa;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    border-color: #e50914;
    color: #e50914;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CenteredMessage = styled.div`
  text-align: center;
  color: #666;
  margin-top: 4rem;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e50914;
  margin-top: 2rem;
`;

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listVideos();
      setVideos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar vídeos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <Layout>
      <Header>
        <Title>Meus Vídeos</Title>
        <RefreshButton onClick={fetchVideos}>↻ Atualizar</RefreshButton>
      </Header>

      {loading && <CenteredMessage>Carregando vídeos...</CenteredMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && videos.length === 0 && (
        <CenteredMessage>Nenhum vídeo encontrado. Faça o primeiro upload!</CenteredMessage>
      )}
      {!loading && !error && videos.length > 0 && (
        <Grid>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default HomePage;
