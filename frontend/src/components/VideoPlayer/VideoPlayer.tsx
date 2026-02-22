import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styled from 'styled-components';

const PlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  display: block;
  max-height: 70vh;
`;

const QualitySelector = styled.div`
  position: absolute;
  bottom: 48px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const QualityButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#e50914' : 'rgba(0,0,0,0.7)')};
  color: #fff;
  border: 1px solid ${({ $active }) => ($active ? '#e50914' : '#555')};
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e50914;
    border-color: #e50914;
  }
`;

const ErrorMessage = styled.p`
  color: #e50914;
  padding: 1rem;
  text-align: center;
`;

interface Level {
  height: number;
  bitrate: number;
  index: number;
}

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setError(null);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        const parsedLevels: Level[] = data.levels.map((lvl, idx) => ({
          height: lvl.height,
          bitrate: lvl.bitrate,
          index: idx,
        }));
        setLevels(parsedLevels);
        setCurrentLevel(-1);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError('Erro ao carregar o vídeo. Tente novamente.');
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else {
      setError('Seu navegador não suporta reprodução HLS.');
    }
  }, [src]);

  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentLevel(levelIndex);
    }
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PlayerWrapper>
      <StyledVideo ref={videoRef} controls playsInline />
      {levels.length > 1 && (
        <QualitySelector>
          <QualityButton $active={currentLevel === -1} onClick={() => handleQualityChange(-1)}>
            Auto
          </QualityButton>
          {levels.map((lvl) => (
            <QualityButton
              key={lvl.index}
              $active={currentLevel === lvl.index}
              onClick={() => handleQualityChange(lvl.index)}
            >
              {lvl.height ? `${lvl.height}p` : `${Math.round(lvl.bitrate / 1000)}k`}
            </QualityButton>
          ))}
        </QualitySelector>
      )}
    </PlayerWrapper>
  );
};

export default VideoPlayer;
