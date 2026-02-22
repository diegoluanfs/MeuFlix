import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const Wrapper = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 4px;
`;

const Track = styled.div`
  width: 100%;
  height: 8px;
  background: #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div<{ $percent: number; $animated?: boolean }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $animated }) =>
    $animated
      ? 'linear-gradient(90deg, #e50914 0%, #ff6b6b 50%, #e50914 100%)'
      : '#e50914'};
  background-size: 200% auto;
  border-radius: 4px;
  transition: width 0.3s ease;
  animation: ${({ $animated }) => ($animated ? shimmer : 'none')} 1.5s linear infinite;
`;

interface UploadProgressProps {
  percent: number;
  label?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ percent, label }) => (
  <Wrapper>
    <Label>
      <span>{label || 'Enviando...'}</span>
      <span>{Math.round(percent)}%</span>
    </Label>
    <Track>
      <Bar $percent={percent} $animated={percent < 100 && percent > 0} />
    </Track>
  </Wrapper>
);

export default UploadProgress;
