import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideo, getVideoStatus } from '../api/videos';
import { Video } from '../types';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import Layout from '../components/Layout/Layout';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 0.9rem;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.2s;

  &:hover {
    color: #e5e5e5;
  }
`;

const VideoWrapper = styled.div`
  margin-bottom: 2rem;
`;

const MetaSection = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const MainMeta = styled.div`
  flex: 1;
  min-width: 260px;
`;

const VideoTitle = styled.h1`
  font-size: 1.6rem;
  color: #e5e5e5;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #aaa;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
`;

const MetaItem = styled.div`
  background: #1f1f1f;
  border-radius: 8px;
  padding: 0.75rem 1rem;
`;

const MetaLabel = styled.div`
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
`;

const MetaValue = styled.div`
  font-size: 0.9rem;
  color: #e5e5e5;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'ready' ? '#1db954' : $status === 'error' ? '#e50914' : '#f5a623'};
  color: #fff;
`;

const ProcessingMessage = styled.div`
  background: #1f1f1f;
  border: 1px solid #f5a623;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  color: #f5a623;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e50914;
  margin-top: 2rem;
`;

const formatDuration = (seconds: number): string => {
  if (!seconds) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchVideo = async () => {
      try {
        const data = await getVideo(id);
        setVideo(data);
        if (data.status === 'processing') {
          startPolling(id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar vídeo.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const startPolling = (videoId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const { status } = await getVideoStatus(videoId);
        setVideo((prev) => (prev ? { ...prev, status: status as Video['status'] } : prev));
        if (status !== 'processing') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const updated = await getVideo(videoId);
          setVideo(updated);
        }
      } catch {
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    }, 5000);
  };

  if (loading) return <Layout><div style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>Carregando...</div></Layout>;
  if (error) return <Layout><ErrorMessage>{error}</ErrorMessage></Layout>;
  if (!video) return null;

  const hlsUrl = video.hlsUrl || `${API_BASE_URL}/data/processed/${video.id}/hls/index.m3u8`;

  return (
    <Layout>
      <BackButton onClick={() => navigate(-1)}>← Voltar</BackButton>

      <VideoWrapper>
        {video.status === 'processing' && (
          <ProcessingMessage>⏳ Este vídeo ainda está sendo processado. Aguarde...</ProcessingMessage>
        )}
        {video.status === 'error' && (
          <ProcessingMessage style={{ borderColor: '#e50914', color: '#e50914' }}>
            ❌ Ocorreu um erro no processamento deste vídeo.
          </ProcessingMessage>
        )}
        {video.status === 'ready' && <VideoPlayer src={hlsUrl} />}
      </VideoWrapper>

      <MetaSection>
        <MainMeta>
          <VideoTitle>{video.title || 'Sem título'}</VideoTitle>
          <Description>{video.description || 'Sem descrição disponível.'}</Description>
          <MetaGrid>
            <MetaItem>
              <MetaLabel>Status</MetaLabel>
              <MetaValue><StatusBadge $status={video.status}>{video.status}</StatusBadge></MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Duração</MetaLabel>
              <MetaValue>{formatDuration(video.duration)}</MetaValue>
            </MetaItem>
            {video.createdAt && (
              <MetaItem>
                <MetaLabel>Enviado em</MetaLabel>
                <MetaValue>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</MetaValue>
              </MetaItem>
            )}
            {video.uploadedBy && (
              <MetaItem>
                <MetaLabel>Por</MetaLabel>
                <MetaValue>{video.uploadedBy}</MetaValue>
              </MetaItem>
            )}
            <MetaItem>
              <MetaLabel>ID</MetaLabel>
              <MetaValue style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{video.id}</MetaValue>
            </MetaItem>
          </MetaGrid>
        </MainMeta>
      </MetaSection>
    </Layout>
  );
};

export default VideoDetailPage;
