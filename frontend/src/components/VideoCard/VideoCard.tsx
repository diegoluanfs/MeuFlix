import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Video } from '../../types';

const Card = styled(Link)`
  display: block;
  background: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  }
`;

const Thumbnail = styled.div<{ $url?: string }>`
  width: 100%;
  padding-top: 56.25%;
  background-color: #2a2a2a;
  background-image: ${({ $url }) => ($url ? `url(${$url})` : 'none')};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #444;
`;

const StatusBadge = styled.span<{ $status: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'ready' ? '#1db954' : $status === 'error' ? '#e50914' : '#f5a623'};
  color: #fff;
`;

const Info = styled.div`
  padding: 0.75rem 1rem;
`;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #e5e5e5;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  font-size: 0.8rem;
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
`;

const formatDuration = (seconds: number): string => {
  if (!seconds) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => (
  <Card to={`/videos/${video.id}`}>
    <Thumbnail $url={video.thumbnailUrl}>
      {!video.thumbnailUrl && <PlaceholderIcon>🎬</PlaceholderIcon>}
      <StatusBadge $status={video.status}>{video.status}</StatusBadge>
    </Thumbnail>
    <Info>
      <Title>{video.title || 'Sem título'}</Title>
      <Description>{video.description || 'Sem descrição'}</Description>
      <Meta>
        <span>{formatDuration(video.duration)}</span>
        {video.createdAt && <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>}
      </Meta>
    </Info>
  </Card>
);

export default VideoCard;
